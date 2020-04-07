<template>
  <div id="prefecture-populations">
    <b-form>
      {{ selectedPrefectures }}
      <b-form-group id="prefectures"
                    label="都道府県"
                    label-align="left"
                    :description="isPrefectureLimitReached ? `${POPULATION_DATA_PREFECTURE_LIMIT}都道府県限定` : ''">
        <b-row v-if="prefectures.length" class="ml-0 mr-0">
          <b-col v-for="prefecture in prefectures" cols="3" :key="prefecture.value">
            <b-form-checkbox v-model="prefecture.isSelected"
                            :value="true"
                            :unchecked-value="false"
                            class="text-left prefecture-checkbox"
                            :disabled="!prefecture.isSelected && isPrefectureLimitReached"
                            @change="handleSetPopulationData">
              {{ prefecture.name }}
            </b-form-checkbox>
          </b-col>
        </b-row>
        <div v-else>
          ロード中...
        </div>
      </b-form-group>
    </b-form>

    <div v-show="isPopulationDataLoading" class="text-center">
      <b-spinner />
    </div>
    <div v-show="!isPopulationDataLoading && populationData.length">
      TODO: responsive graph via Highcharts<br>
      {{ populationData }}
    </div>

    <!-- TODO: delete. Used for testing
      <button @click="handleSetPopulationData">Trigger API call</button>
    -->
  </div>
</template>

<script>
const POPULATION_DATA_PREFECTURE_LIMIT = 11 // RESAS response returns 400 when request contains more than 11 prefectures

export default {
  name: 'PrefecturePopulations',
  props: {
  },
  data () {
    return {
      prefectures: [],
      populationData: [],
      isPopulationDataLoading: false
    }
  },
  computed: {
    isPrefectureLimitReached () {
      // TODO: get the length of selectedPrefectures here
      return this.prefectures.reduce((acc, prefecture) => {
        return acc + (prefecture.isSelected ? 1 : 0)
      }, 0) >= POPULATION_DATA_PREFECTURE_LIMIT
    },
    selectedPrefectures () {
      return this.prefectures.filter(prefecture => prefecture.isSelected).map(prefecture => prefecture.value)
    }
  },
  created () {
    this.POPULATION_DATA_PREFECTURE_LIMIT = POPULATION_DATA_PREFECTURE_LIMIT
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
      const apiPayload = await this.getPrefectures()

      // TODO: loading spinner start

      // TODO: not DRY. Error handling system
      if (apiPayload.data.result) {
        this.prefectures = apiPayload.data.result.map(prefecture => {
          return {
            name: prefecture.prefName,
            value: prefecture.prefCode, // TODO: We
            isSelected: false
          }
        })
      }
      // TODO: else, check if prefectures are the right format, otherwise throw error

      // TODO: loading spinner stop
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
        this.populationData = apiPayload.data.result.data
        /*
        .map(populationDataSegment => {
          return {
            ...
          }
        })
        */
      } else {
        // TODO: better return values
        this.populationData = []
      }
      this.isPopulationDataLoading = false
    },
    handleSetPopulationData () {
      // TODO: consider a watcher instead of the @change event
      this.$nextTick(function () {
        if (this.selectedPrefectures.length) {
          this.setPopulationData(this.selectedPrefectures)
        } else {
          this.populationData = []
        }
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
