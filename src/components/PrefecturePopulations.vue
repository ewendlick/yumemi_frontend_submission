<template>
  <div id="prefecture-populations">
    <b-form>
      <b-form-group id="prefectures"
                    label="都道府県"
                    label-align="left">
        <div v-show="isPrefecturesLoading" class="text-center">
          <b-spinner />
        </div>
        <b-row v-show="!isPrefecturesLoading && prefectures.length" class="ml-0 mr-0">
          <b-col v-for="prefecture in prefectures" md="3" sm="4" cols="6" :key="prefecture.value">
            <b-form-checkbox v-model="prefecture.isSelected"
                            :value="true"
                            :unchecked-value="false"
                            class="text-left prefecture-checkbox"
                            @change="handleSetPopulationData">
              {{ prefecture.name }}
            </b-form-checkbox>
          </b-col>
        </b-row>

      </b-form-group>
    </b-form>

    <div v-show="isPopulationDataLoading" class="text-center">
      <b-spinner />
    </div>
    <!--<div v-show="!isPopulationDataLoading && populationData.length">
      {{ populationData }}
    </div>-->

    <!-- TODO: move HighChart? Hide when data is empty? -->
    <HighChart :options="graphOptions" />
  </div>
</template>

<script>
// const START_YEAR = 1970
// const END_YEAR = 2020
// const YEAR_INTERVAL = 10 // Must be multiples of 5
const POPULATION_DATA_DEFAULT_OPTIONS = {
  title: {
    text: null,
    style: {
      display: 'none'
    }
  },
  /*
  subtitle: {
    text: 'Source: thesolarfoundation.com'
  },
  */

  yAxis: {
    title: {
      text: '人口数'
    }
  },
  xAxis: {
    accessibility: {
      rangeDescription: '年度'
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      pointStart: 1960, // TODO: match the frontend_wireframe.jpg or the API content?
      pointInterval: 5 // years
    }
  },
  colors: ['#90b44b', '#33a6b8', '#0b132b', '#3c2541', '#dfc2f2', '#aF2bbf', '#a14ebf', '#6c91bf', '#ef3e36', '#2e282a', '#fff689'],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }
}

export default {
  name: 'PrefecturePopulations',
  props: {
  },
  data () {
    return {
      prefectures: [],
      isPrefecturesLoading: false,
      isPopulationDataLoading: false,
      graphOptions: {
      }
    }
  },
  computed: {
    selectedPrefectures () {
      return this.prefectures.filter(prefecture => prefecture.isSelected).map(prefecture => prefecture.value)
    }
  },
  created () {
    this.setPrefectures()
    if (this.prefectures.length) {

    }
    // TODO: else, error message
  },
  methods: {
    getPrefectures () {
      // TODO: switch this to the try catch format with await?
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
      this.isPrefecturesLoading = true
      const apiPayload = await this.getPrefectures()

      // TODO: not DRY. Error handling system
      if (apiPayload.data.result) {
        this.prefectures = apiPayload.data.result.map(prefecture => {
          return {
            name: prefecture.prefName,
            value: prefecture.prefCode, // TODO: Change this to "code", since we aren't feeding this into Bootstrap checkboxes
            isSelected: false
          }
        })
      }
      // TODO: else, check if prefectures are the right format, otherwise throw error

      this.isPrefecturesLoading = false
    },
    getPopulationData (prefectureCodes) {
      console.log('inside prefectureCodes', prefectureCodes)
      if (prefectureCodes.length === 0) return []

      const primaryPrefectureCode = prefectureCodes[0]
      const additionalPrefectureCodes = prefectureCodes.slice(1).map(prefectureCode => {
        return `${prefectureCode}_`
      }).join(',')

      prefectureCodes = prefectureCodes.join(',')
      // TODO: switch this to the try catch format with await?
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
      this.isPopulationDataLoading = true
      const apiPayload = await this.getPopulationData(prefectureCodes)
      // TODO: not DRY. Error handling system
      if (apiPayload.data.result) {
        console.log('payload', apiPayload)
        const populationData = apiPayload.data.result.data.filter(populationSegment => {
          return populationSegment.label === '総人口'
        })[0].data

        console.log(populationData)
        // console.log(END_YEAR)

        const graphOptions = POPULATION_DATA_DEFAULT_OPTIONS
        graphOptions.series = [

        ]

        graphOptions.series = [
          {
            name: 'Installation', // TODO: switch to name of prefecture
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
          }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
          }, {
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
          }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
          }
        ]

        this.graphOptions = graphOptions
      } else {
        this.graphOptions = POPULATION_DATA_DEFAULT_OPTIONS
      }
      this.isPopulationDataLoading = false
    },
    handleSetPopulationData () {
      // TODO: consider a watcher instead of the @change event
      this.$nextTick(function () {
        console.log('ABC')
        if (this.selectedPrefectures.length) {
          console.log('HEY')
          this.setPopulationData(this.selectedPrefectures)
        } else {
          this.graphOptions = POPULATION_DATA_DEFAULT_OPTIONS
        }
      })
    },
    prefectureCodeToName (prefectureCode, prefectures) {
      return prefectures.find(prefecture => {
        return prefecture.value === prefectureCode
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #prefecture-populations {
    background-color: #fff;
    color: #2c3e50;
    padding: 2rem;
  }
</style>

<style lang="scss">
  #prefectures {
    legend {
      display: inline-block;
      min-width: 2rem;
      padding: 2px 10px 1px;
      background: #a0a0a0;
      border-radius: 0 10px 0 6px;
      text-align: center;
      color: #fff;
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1.54;
    }

    // OVERRIDES
    .custom-control-input:checked ~ .custom-control-label::before {
      color: #fff;
      background-color: #87b356 !important; // HACK
      border-color: #87b356 !important // HACK
    }

    .custom-control-input:not(:disabled):active ~ .custom-control-label::before {
      color: #fff;
      background-color: #99d694 !important; // HACK
      border-color: #99d694 !important; // HACK
    }
  }
</style>
