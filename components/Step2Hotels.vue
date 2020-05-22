<template lang="pug">
  div
    BookInfo

    h5.mb-3 {{ $t('bookChooseHotel') }}

    Hotel.mb-5(
      v-for="(hotel, hindex) in hotels"
      :key="'h' + hindex"
      :hotel="hotel"
      :roomtypes="roomtypes"
      :selectedHotel="selectedHotel"
      :selectedRooms="selectedRooms"
      @selectHotel="selectHotel"
      @selectRoom="selectRoom($event.index, $event.room)"
      @goNext="goNext"
    )

    b-modal(
      v-model="waitinglistModal"
      :title="$t('waitinglistTitle') + ': ' + waitinglistRoom.roomname"
      :hide-footer="true"
      size="lg"
      centered
    )
      Waitinglist(
        @close="waitinglistModal = false"
        :trip="tripinfo"
        :room="waitinglistRoom"
        :people="numberOfPeople"
      )

    b-modal(
      centered
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      body-class="no-padding"
      v-model="priceModal"
      :hide-footer="true"
      :hide-header="true"
      ref="infoModal"
      size="lg"
    )
      .alert.mb-0
        .d-flex.align-items-center
          h3.mb-0
            fa.mr-3(icon="info-circle")
          .flex-fill(
            v-html="$t('bookPriceChanged', { priceChangedSinceStart: $n(tripinfo.priceChangedSinceStart) })"
          )
          button.btn.btn-blue.ml-3(
            @click="$refs['infoModal'].hide()"
          ) {{ $t('ok') }}
</template>

<script>
import { mapState } from 'vuex'

import BookInfo from './BookInfo'
import Waitinglist from './Waitinglist'
import Hotel from './Hotel'

export default {
  components: {
    Waitinglist,
    BookInfo,
    Hotel
  },

  data () {
    return {
      selectedRooms: [],
      selectedRoomAmounts: {},
      selectedHotel: null,

      waitinglistModal: false,
      waitinglistRoom: {},

      priceModal: false
    }
  },

  computed: {
    ...mapState('book', {
      tripinfo: 'tripinfo',
      roomtypes: 'roomtypes',
      hoteltypes: 'hoteltypes',
      numberOfPeople: 'numberOfPeople'
    }),

    peopleAssigned () {
      let people = 0

      Object.keys(this.selectedRoomAmounts).forEach((r) => {
        people += (this.roomtypes[r].amount_in_room * this.selectedRoomAmounts[r])
      })

      return people
    },

    hotels () {
      if (typeof this.hoteltypes !== 'object') {
        return
      }
      const hotels = []

      Object.keys(this.hoteltypes).forEach((hotelId) => {
        const hotel = this.hoteltypes[hotelId]

        hotels.push(hotel)
      })

      hotels.sort((a, b) => a.min_additional_cost - b.min_additional_cost)

      return hotels
    }
  },

  mounted () {
    if (this.tripinfo.priceChangedSinceStart) {
      this.priceModal = true
    }
  },

  methods: {
    selectRoom (index, room) {
      this.$set(this.selectedRooms, index, room)
    },

    selectHotel (id) {
      this.selectedHotel = id
      this.selectedRooms = []
    },

    getRoomArray (room) {
      if (!room) {
        return []
      }

      return [...Array(parseInt(room) + 1).keys()]
    },

    goNext () {
      const params = {}

      params.selected_rooms = this.selectedRooms.map((r) => {
        return {
          roomid: r,
          amount: 1
        }
      })

      this.$emit('next', params)
    },

    openWaitinglist (room) {
      this.waitinglistRoom = room
      this.waitinglistModal = true
    }
  }
}
</script>
