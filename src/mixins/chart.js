const START_YEAR = 1970
const END_YEAR = 2020
const YEAR_INTERVAL = 5 // Must be multiples of 5 - TODO: Different year intervals are unimplemented
const POPULATION_DATA_DEFAULT_OPTIONS = {
  title: {
    text: null,
    style: {
      display: 'none'
    }
  },
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
      pointStart: START_YEAR,
      pointInterval: YEAR_INTERVAL
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
  },
  credits: {
    enabled: false
  }
}

export default {
  methods: {
    generateChartData (prefectures) {
      const graphOptions = POPULATION_DATA_DEFAULT_OPTIONS

      graphOptions.series = prefectures.filter(prefecture => prefecture.isSelected)
        .map(prefecture => {
          const builtPopulationData = prefecture.populationData.filter(populationDataSegment => {
            return populationDataSegment.year >= START_YEAR && populationDataSegment.year <= END_YEAR
          }).map(populationDataSegment => populationDataSegment.value)

          return {
            name: prefecture.name,
            data: builtPopulationData
          }
        })
      return graphOptions
    }
  }
}
