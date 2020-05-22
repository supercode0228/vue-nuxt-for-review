<template lang="pug">
  .row.book-trip
    .col-12
      Wizard.mb-3(
        :step="wizardstep"
        :steps="steps"
      )

    .col-12.py-5.mt-5.text-center(
      v-show="loading"
    )
      p(v-if="$route.params.step == 1 || !$route.params.step")
        strong {{ $t('bookLoadingMessageSearchingForRooms') }}
      p(v-if="$route.params.step == 2")
        strong {{ $t('bookLoadingMessageSubmittingRooms') }}
      p(v-if="$route.params.step == 3")
        strong {{ $t('bookLoadingMessageSendingTravelerInformation') }}
      p(v-if="$route.params.step == 4")
        strong {{ $t('bookLoadingMessageGettingPayment') }}
      b-spinner(
        variant="primary"
        type="grow"
      )

    .col-12.py-5.mt-5.text-center(
      v-if="initError"
    )
      .alert.alert-danger {{ $t('serverError') }}

    .col-12(
      v-if="!initError"
      v-show="!loading"
    )
      h4.mb-3(
        v-if="$route.params.step != 6"
      ) {{ tripinfo.tripdate }} {{ tripinfo.tripname }}

      Step1(
        v-if="$route.params.step == 1 || !$route.params.step"
        @next="handleCustomerData"
      )

      Step2Rooms(
        v-if="$route.params.step == 2 && !tripinfo.hoteltype_needed"
        @next="handleRoomData"
      )

      Step2Hotels(
        v-if="$route.params.step == 2 && tripinfo.hoteltype_needed"
        @next="handleRoomData"
      )

      Step3Address(
        v-if="$route.params.step == 3"
        @next="handleAddressData"
      )

      Step4(
        v-if="$route.params.step == 4"
        @next="getPayment"
      )

      Step5Payment(
        v-if="$route.params.step == 5"
        @next="handleAddressData"
        :checkout="checkout"
      )

      Step6Final(
        v-if="$route.params.step == 6"
      )

    b-modal(
      centered
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      body-class="no-padding"
      v-model="showModal"
      :hide-footer="true"
      :hide-header="true"
      ref="errorModal"
      size="lg"
    )
      .alert.alert-danger.mb-0
        .d-flex.align-items-center
          h3.mb-0
            fa.mr-3(icon="info-circle")
          span.flex-fill {{ error }}
          button.btn.btn-blue.ml-3(
            @click="$refs['errorModal'].hide()"
          ) {{ $t('ok') }}
</template>

<script>
import * as Bambora from '@bambora/checkout-sdk-web'
import { mapState } from 'vuex'

import Wizard from '@/components/book/Wizard'
import Step1 from '@/components/book/Step1'
import Step2Rooms from '@/components/book/Step2Rooms'
import Step2Hotels from '@/components/book/Step2Hotels'
import Step3Address from '@/components/book/Step3Address'
import Step4 from '@/components/book/Step4'
import Step5Payment from '@/components/book/Step5Payment'
import Step6Final from '@/components/book/Step6Final'

export default {
  layout: 'noheader-layout',

  components: {
    Wizard,
    Step1,
    Step2Rooms,
    Step2Hotels,
    Step3Address,
    Step4,
    Step5Payment,
    Step6Final
  },

  data () {
    return {
      loading: true,
      initError: null,
      error: null,
      showModal: false,
      checkout: new Bambora.InlineCheckout()
    }
  },

  computed: {
    ...mapState('book', {
      tripinfo: 'tripinfo'
    }),

    wizardstep () {
      const step = parseInt(this.$route.params.step)

      if (step <= 2 || !step) {
        return 1
      } else if (step === 5 || step === 4) {
        return 3
      } else if (step === 6) {
        return 4
      }

      return 2
    }
  },

  async asyncData ({ store, params, app, error, redirect, query }) {
    const step = parseInt(params.step)
    const steps = [
      app.i18n.t('bookStepRoomInfo'),
      app.i18n.t('bookStepAddress'),
      app.i18n.t('bookStepPayment'),
      app.i18n.t('bookStepFinal')
    ]

    if (step > 1 && !store.state.book.tripinfo) {
      redirect(`${store.state.locale.urls.book}/${params.tripid}/1?price=${query.price}`)
    }

    if (!params.step || step === 1) {
      try {
        const result = await store.dispatch('book/init', { tripid: params.tripid, initialPrice: query.price })

        if (!result || result.error) {
          if (!result) {
            app.$sentry.captureMessage('Trip init: Server response empty')
          }
          return {
            loading: false,
            steps,
            initError: true
          }
        }
      } catch (e) {
        return {
          loading: false,
          steps,
          initError: true
        }
      }
    }

    return {
      initialPrice: query.price,
      steps,
      loading: false
    }
  },

  methods: {
    async handleCustomerData (data) {
      this.setLoading(true)
      this.noRoomFound = false

      try {
        if (this.tripinfo.roomstypes_needed) {
          const result = await this.$store.dispatch('book/roomTypes', data)

          if (!result || result.error) {
            if (!result) {
              this.$sentry.captureMessage('Trip roomTypes: Server response empty')
            }

            this.setLoading(false)
            this.error = result.message || this.$t('serverError')
            this.showModal = true
            return
          }

          this.setLoading(false)

          this.goToStep(2)

          return
        }

        const result = await this.$store.dispatch('book/customerData', data)
        this.setLoading(false)

        if (!result || result.error) {
          if (!result) {
            this.$sentry.captureMessage('Trip customerData: Server response empty')
          }
          this.error = result.message || this.$t('serverError')
          this.showModal = true
          return
        }

        this.goToStep(3)
      } catch (e) {
        this.setLoading(false)
        this.error = this.$t('serverError')
        this.showModal = true
      }
    },

    async handleRoomData (data) {
      try {
        this.setLoading(true)
        const result = await this.$store.dispatch('book/customerData', data)
        this.setLoading(false)

        if (!result || result.error) {
          if (!result) {
            this.$sentry.captureMessage('Trip customerData (roomData): Server response empty')
          }
          this.error = result.message || this.$t('serverError')
          this.showModal = true
          return
        }

        this.goToStep(3)
      } catch (e) {
        this.setLoading(false)
        this.error = this.$t('serverError')
        this.showModal = true
      }
    },

    async handleAddressData (data) {
      try {
        this.setLoading(true)
        const result = await this.$store.dispatch('book/addressData', data)
        this.setLoading(false)

        if (!result || result.error) {
          if (!result) {
            this.$sentry.captureMessage('Trip addressData: Server response empty')
          }
          this.error = result.message || this.$t('serverError')
          this.showModal = true
          return
        }

        this.goToStep(4)
      } catch (e) {
        this.setLoading(false)
        this.error = this.$t('serverError')
        this.showModal = true
      }
    },

    async getPayment (data) {
      try {
        this.setLoading(true)
        const result = await this.$store.dispatch('book/paymentData', data)

        if (!result || result.error) {
          if (!result) {
            this.$sentry.captureMessage('Trip paymentData: Server response empty')
          }
          this.error = result.message || this.$t('serverError')
          this.showModal = true
          this.goToStep(3)
          return
        }

        if (!result.direct_payment_needed) {
          const finalresult = await this.$store.dispatch('book/finalize', data)

          if (!finalresult || finalresult.error) {
            this.error = finalresult.message || this.$t('serverError')
            this.showModal = true
            this.goToStep(3)
            return
          }

          this.goToStep(6)
        }

        this.setLoading(false)
      } catch (e) {
        this.setLoading(false)
        this.error = this.$t('serverError')
        this.showModal = true
      }
    },

    setLoading (loading) {
      this.loading = loading

      if (loading) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    },

    goToStep (step) {
      this.$router.push(`${this.localeURLs.book}/${this.$route.params.tripid}/${step}?price=${this.initialPrice}`)
    }
  }
}
</script>
