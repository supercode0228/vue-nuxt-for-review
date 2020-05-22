<template lang="pug">
  .b-modal
    .text-center(
        v-if="loading"
    )
      b-spinner(
        variant="primary"
        type="grow"
      )

    .row(
      v-if="!loading && submitted"
    )
      p.col-12 {{ $t('bookRoomWaitinglistSubmitted') }}
      .col-6
        button.btn.btn-blue(
          @click="$emit('close')"
        ) {{ $t('bookRoomWaitinglistContinue') }}

    form(
      v-if="!loading && !submitted"
      @submit.prevent="add"
    )
      .alert.alert-danger(
        v-if="error"
      ) {{ $t('bookRoomWaitinglistError') }}

      p {{ $t('bookRoomWaitinglistInstructions', { room: room.roomname }) }}
      .form-group
        label(for="waiting-name") {{ $t('nameLabel') }}
        input#waiting-name.form-control(
          v-model="name"
          :class="{ 'is-invalid': $v.name.$error }"
        )
        .col-12.invalid-feedback(
          v-if="$v.name.$error"
        ) {{ $t('formFieldRequiredError') }}
      .form-group
        label(for="waiting-phone") {{ $t('phoneLabel') }}
        input#waiting-phone.form-control(
          v-model="phone"
          :class="{ 'is-invalid': $v.phone.$error }"
        )
        .col-12.invalid-feedback(
          v-if="$v.phone.$error"
        ) {{ $t('formFieldRequiredError') }}
      .form-group
        button.btn.btn-blue {{ $t('addToWaitinglistButton') }}
</template>

<script>
import { validationMixin } from 'vuelidate'
const { required } = require('vuelidate/lib/validators')

export default {
  mixins: [validationMixin],

  props: {
    trip: {
      type: Object,
      required: true
    },
    room: {
      type: Object,
      default: () => ({})
    },
    people: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      error: false,
      loading: false,
      submitted: false,
      different_rooms_possible: false,
      roomtypes: [],

      name: '',
      phone: ''
    }
  },

  validations: {
    name: {
      required
    },
    phone: {
      required
    }
  },

  methods: {
    async add () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      this.loading = true

      try {
        const result = await this.$axios
          .$post(`/${this.$store.state.locale.locale}/waitinglist-add/${this.trip.tripid}`, {
            pax: this.people,
            name: this.name,
            phone: this.phone,
            roomtype: this.room.roomid
          })

        this.loading = false

        if (result.error) {
          this.error = true
          return
        }

        this.submitted = true
      } catch (e) {
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>
