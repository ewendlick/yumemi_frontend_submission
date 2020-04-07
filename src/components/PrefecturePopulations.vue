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
          <b-col v-for="prefecture in prefectures" md="3" sm="4" cols="6" :key="prefecture.code">
            <b-form-checkbox v-model="prefecture.isSelected"
                            :value="true"
                            :unchecked-value="false"
                            class="text-left prefecture-checkbox"
                            @change="handleSetPopulationData(prefecture.code)">
              {{ prefecture.name }}
            </b-form-checkbox>
          </b-col>
        </b-row>

      </b-form-group>
    </b-form>

    <!-- TODO: fixed height -->
    <div v-show="isPopulationDataLoading" class="text-center">
      <b-spinner />
    </div>

    <HighChart :options="graphOptions" />
  </div>
</template>

<script>
import Chart from '@/mixins/chart'

export default {
  name: 'PrefecturePopulations',
  mixins: [Chart],
  props: {
  },
  data () {
    return {
      prefectures: [],
      isPrefecturesLoading: false,
      isPopulationDataLoading: false,
      graphOptions: {}
    }
  },
  created () {
    this.setPrefectures()
    if (this.prefectures.length) {
      // TODO: handle scenario where there are not any prefectures or API call fails
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
            code: prefecture.prefCode,
            isSelected: false,
            populationData: null
          }
        })
      }
      this.isPrefecturesLoading = false
    },
    getPopulationData (prefectureCode) {
      const targetPrefecture = this.prefectures.find(prefecture => prefecture.code === prefectureCode)
      if (targetPrefecture.populationData !== null) {
        return targetPrefecture.populationData
      }

      // TODO: switch this to the try catch format with await?
      const payload = this.$resas.get(`api/v1/population/composition/perYear?prefCode=${prefectureCode}&cityCode=-`)
        .then((response) => {
          return response
        })
        .catch((e) => {
          // TODO: Error-handling system
          alert(e)
        })
      return payload
    },
    async setPopulationData (prefectureCode, value) {
      this.isPopulationDataLoading = true

      // Only need to perform this step if checkbox is checked
      if (value) {
        const apiPayload = await this.getPopulationData(prefectureCode)

        // TODO: not DRY. Error handling system
        if (apiPayload.data && apiPayload.data.result) {
          console.log('payload', apiPayload.data.result.data)
          const populationData = apiPayload.data.result.data.filter(populationSegment => {
            return populationSegment.label === '総人口'
          })[0].data

          this.prefectures[this.prefectures.findIndex(prefecture => prefecture.code === prefectureCode)].populationData = populationData
        }
      }

      this.isPopulationDataLoading = false
    },
    async handleSetPopulationData (prefectureCode) {
      await this.setPopulationData(prefectureCode, event.returnValue)
      this.graphOptions = this.generateChartData(this.prefectures)
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
