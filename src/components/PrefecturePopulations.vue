<template>
  <div>
    TODO: label<br>
    TODO: responsive checkboxes<br>
    {{ prefectures }}<br>
    TODO: responsive graph via Highcharts<br>
  </div>
</template>

<script>
export default {
  name: 'PrefecturePopulations',
  props: {
  },
  data () {
    return {
      prefectures: []
    }
  },
  created () {
    // TODO: pull the prefecture content
    this.setPrefectures()
    if (this.prefectures.length) {

    }
    // TODO: else, error message
  },
  methods: {
    getPrefectures () {
      return this.$resas.get('api/v1/prefectures')
        .then((response) => {
          return response
        })
        .catch((e) => {
          // TODO: Error-handling system
          alert(e)
        })
    },
    async setPrefectures () {
      const apiPayload = await this.getPrefectures()

      if (apiPayload.data.result) {
        this.prefectures = apiPayload.data.result.map(prefecture => {
          return {
            name: prefecture.prefName,
            value: prefecture.prefCode
          }
        })
      }

      // TODO: check if prefectures are the right format, otherwise throw error
    },
    getPopulationData () {

    }
    // TODO: handle change of checkboxes values
  }
}
</script>

<style scoped lang="scss">

</style>
