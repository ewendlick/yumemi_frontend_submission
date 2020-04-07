<template>
  <div id="prefecture-populations">
    <header>
      <h2 class="text-center">日本人口</h2>
    </header>
    <section>
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

      <div id="population-data-spinner-container" class="text-center">
        <b-spinner v-show="isPopulationDataLoading" />
      </div>

      <HighChart :options="chartOptions" />
    </section>
  </div>
</template>

<script>
import Chart from '@/mixins/chart'

const TARGET_DATA_TYPE = '総人口'

export default {
  name: 'PrefecturePopulations',
  mixins: [Chart],
  data () {
    return {
      prefectures: [],
      isPrefecturesLoading: false,
      isPopulationDataLoading: false,
      chartOptions: {
        // Hides the title and credits on first load
        title: {
          text: null
        },
        credits: {
          enabled: false
        }
      }
    }
  },
  created () {
    this.setPrefectures()
  },
  methods: {
    getPrefectures () {
      return this.$resas.get('api/v1/prefectures')
        .then((response) => {
          return response
        })
        .catch((e) => {
          // TODO: Error-handling system
          alert(`都道府県データを取得できませんでした。ページをリーロドとかインターネット接続ご確認してください: ${e}`)
        })
    },
    async setPrefectures () {
      this.isPrefecturesLoading = true
      const apiPayload = await this.getPrefectures()

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

      // If populationData already exists (the API endpoint has already been called), return saved data
      if (targetPrefecture.populationData !== null) {
        return targetPrefecture.populationData
      }

      const payload = this.$resas.get(`api/v1/population/composition/perYear?prefCode=${prefectureCode}&cityCode=-`)
        .then((response) => {
          return response
        })
        .catch((e) => {
          // TODO: Error-handling system
          alert(`人口データを取得できませんでした: ${e}`)
        })
      return payload
    },
    async setPopulationData (prefectureCode, value) {
      this.isPopulationDataLoading = true

      // Only need to perform this step if checkbox is checked
      if (value) {
        const apiPayload = await this.getPopulationData(prefectureCode)

        if (apiPayload.data && apiPayload.data.result) {
          const populationData = apiPayload.data.result.data.filter(populationSegment => {
            return populationSegment.label === TARGET_DATA_TYPE
          })[0].data

          this.prefectures[this.prefectures.findIndex(prefecture => prefecture.code === prefectureCode)].populationData = populationData
        }
      }

      this.isPopulationDataLoading = false
    },
    async handleSetPopulationData (prefectureCode) {
      await this.setPopulationData(prefectureCode, event.returnValue)
      this.chartOptions = this.generateChartData(this.prefectures)
    }
  }
}
</script>

<style scoped lang="scss">
  #prefecture-populations {
    background-color: #fff;
    color: #2c3e50;

    header {
      border-bottom: #efefef 1px solid;
      padding-top: 0.5rem;

      h2 {
        font-weight: bold;
      }
    }

    section {
      padding: 2rem;

      #population-data-spinner-container {
        height: 40px;
      }
    }
  }
</style>

<style lang="scss">
  #prefectures {
    legend {
      display: inline-block;
      min-width: 2rem;
      padding: 2px 10px 1px;
      margin-bottom: 1rem;
      background: #3d6d5f;
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
      background-color: #87b356 !important; // HACK: Using !important only due to time constraints
      border-color: #87b356 !important // HACK: Using !important only due to time constraints
    }

    .custom-control-input:not(:disabled):active ~ .custom-control-label::before {
      color: #fff;
      background-color: #99d694 !important; // HACK: Using !important only due to time constraints
      border-color: #99d694 !important; // HACK: Using !important only due to time constraints
    }
  }
</style>
