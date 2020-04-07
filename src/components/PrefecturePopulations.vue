<template>
  <div>
    TODO: label<br>
    TODO: responsive checkboxes<br>
    {{ prefectures }}<br>
    TODO: responsive graph via Highcharts<br>
    {{ populationData }}

    <button @click="handleSetPopulationData">Trigger API call</button>
  </div>
</template>

<script>
export default {
  name: 'PrefecturePopulations',
  props: {
  },
  data () {
    return {
      prefectures: [],
      populationData: []
    }
  },
  created () {
    // TODO: loading spinner
    this.setPrefectures()
    if (this.prefectures.length) {

    }
    // TODO: else, error message

    // TODO: end loading spinner
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

      // TODO: not DRY. Error handling system
      if (apiPayload.data.result) {
        this.prefectures = apiPayload.data.result.map(prefecture => {
          return {
            name: prefecture.prefName,
            value: prefecture.prefCode
          }
        })
      }
      // TODO: else, check if prefectures are the right format, otherwise throw error
    },
    getPopulationData (prefectureCodes) {
      if (prefectureCodes.length === 0) return []

      const primaryPrefectureCode = prefectureCodes[0]
      const additionalPrefectureCodes = prefectureCodes.slice(1).map(prefectureCode => {
        return `${prefectureCode}_`
      }).join(',')

      prefectureCodes = prefectureCodes.join(',')
      console.log(prefectureCodes)
      return this.$resas.get(`api/v1/population/composition/perYear?prefCode=${primaryPrefectureCode}&cityCode=-&addArea=${additionalPrefectureCodes}`)
        .then((response) => {
          return response
        })
        .catch((e) => {
          // TODO: Error-handling system
          alert(e)
        })
    },
    async setPopulationData (prefectureCodes) {
      const apiPayload = await this.getPopulationData(prefectureCodes)

      // TODO: not DRY. Error handling system
      if (apiPayload.data.result) {
        this.populationData = apiPayload.data.result
        /*
        .map(prefecture => {
          return {
            name: prefecture.prefName,
            value: prefecture.prefCode
          }
        })
        */
      }
    },
    handleSetPopulationData () {
      // TODO: loading spinner

      // this.setPopulationData([1, 2])
      this.setPopulationData([1])

      // TODO: end loading spinner
    }
    // TODO: handle change of checkboxes values
  }
}
</script>

<style scoped lang="scss">

</style>
