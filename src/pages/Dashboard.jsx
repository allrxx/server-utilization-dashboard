import React from 'react';
import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import './Dashboard.css';
import Bot from '../K8/Bot';
import CpuUtilizationChart from '../components/CpuUtilizationChart';

const data = [
  {
    dateTime: "2017-01-01 00:00:00",
    trendValue: 0.000004633061999979366,
    trendLower: 0.000004633061999979366,
    trendUpper: 0.000004633061999979366
  },
  {
    dateTime: "2017-01-01 00:07:14",
    trendValue: 0.000002053614990148299,
    trendLower: 0.000002053614990148299,
    trendUpper: 0.000002053614990148299
  },
  {
    dateTime: "2017-01-01 00:14:28",
    trendValue: -4.696237915722932e-7,
    trendLower: -4.696237915722932e-7,
    trendUpper: -4.696237915722932e-7
  },
  {
    dateTime: "2017-01-01 00:21:42",
    trendValue: -0.000002917542943283574,
    trendLower: -0.000002917542943283574,
    trendUpper: -0.000002917542943283574
  },
  {
    dateTime: "2017-01-01 00:28:56",
    trendValue: -0.000005272717321761521,
    trendLower: -0.000005272717321761521,
    trendUpper: -0.000005272717321761521
  },
  {
    dateTime: "2017-01-01 00:36:10",
    trendValue: -0.0000075196533199899375,
    trendLower: -0.0000075196533199899375,
    trendUpper: -0.0000075196533199899375
  },
  {
    dateTime: "2017-01-01 00:43:25",
    trendValue: -0.000009649753396486648,
    trendLower: -0.000009649753396486648,
    trendUpper: -0.000009649753396486648
  },
  {
    dateTime: "2017-01-01 00:50:39",
    trendValue: -0.000011642193436541509,
    trendLower: -0.000011642193436541509,
    trendUpper: -0.000011642193436541509
  },
  {
    dateTime: "2017-01-01 00:57:53",
    trendValue: -0.00001349349160521152,
    trendLower: -0.00001349349160521152,
    trendUpper: -0.00001349349160521152
  },
  {
    dateTime: "2017-01-01 01:05:07",
    trendValue: -0.000015197720091494312,
    trendLower: -0.000015197720091494312,
    trendUpper: -0.000015197720091494312
  },
  {
    dateTime: "2017-01-01 01:12:21",
    trendValue: -0.000016751619608348525,
    trendLower: -0.000016751619608348525,
    trendUpper: -0.000016751619608348525
  },
  {
    dateTime: "2017-01-01 01:19:35",
    trendValue: -0.00001815463159225644,
    trendLower: -0.00001815463159225644,
    trendUpper: -0.00001815463159225644
  },
  {
    dateTime: "2017-01-01 01:26:50",
    trendValue: -0.000019411610309618646,
    trendLower: -0.000019411610309618646,
    trendUpper: -0.000019411610309618646
  },
  {
    dateTime: "2017-01-01 01:34:04",
    trendValue: -0.000020521562068199403,
    trendLower: -0.000020521562068199403,
    trendUpper: -0.000020521562068199403
  },
  {
    dateTime: "2017-01-01 01:41:18",
    trendValue: -0.00002149487406298001,
    trendLower: -0.00002149487406298001,
    trendUpper: -0.00002149487406298001
  },
  {
    dateTime: "2017-01-01 01:48:32",
    trendValue: -0.000022341289886683338,
    trendLower: -0.000022341289886683338,
    trendUpper: -0.000022341289886683338
  },
  {
    dateTime: "2017-01-01 01:55:46",
    trendValue: -0.00002307279874535972,
    trendLower: -0.00002307279874535972,
    trendUpper: -0.00002307279874535972
  },
  {
    dateTime: "2017-01-01 02:03:00",
    trendValue: -0.000023703429085120177,
    trendLower: -0.000023703429085120177,
    trendUpper: -0.000023703429085120177
  },
  {
    dateTime: "2017-01-01 02:10:15",
    trendValue: -0.000024250181141424732,
    trendLower: -0.000024250181141424732,
    trendUpper: -0.000024250181141424732
  },
  {
    dateTime: "2017-01-01 02:17:29",
    trendValue: -0.00002472793487491828,
    trendLower: -0.00002472793487491828,
    trendUpper: -0.00002472793487491828
  },
  {
    dateTime: "2017-01-01 02:24:43",
    trendValue: -0.000025156635828546837,
    trendLower: -0.000025156635828546837,
    trendUpper: -0.000025156635828546837
  },
  {
    dateTime: "2017-01-01 02:31:57",
    trendValue: -0.000025555799539044067,
    trendLower: -0.000025555799539044067,
    trendUpper: -0.000025555799539044067
  },
  {
    dateTime: "2017-01-01 02:39:11",
    trendValue: -0.000025945526552167343,
    trendLower: -0.000025945526552167343,
    trendUpper: -0.000025945526552167343
  },
  {
    dateTime: "2017-01-01 02:46:25",
    trendValue: -0.000026346156968551135,
    trendLower: -0.000026346156968551135,
    trendUpper: -0.000026346156968551135
  },
  {
    dateTime: "2017-01-01 02:53:40",
    trendValue: -0.000026778964252981084,
    trendLower: -0.000026778964252981084,
    trendUpper: -0.000026778964252981084
  },
  {
    dateTime: "2017-01-01 03:00:54",
    trendValue: -0.000027261756180796726,
    trendLower: -0.000027261756180796726,
    trendUpper: -0.000027261756180796726
  },
  {
    dateTime: "2017-01-01 03:08:08",
    trendValue: -0.00002781442531695145,
    trendLower: -0.00002781442531695145,
    trendUpper: -0.00002781442531695145
  },
  {
    dateTime: "2017-01-01 03:15:22",
    trendValue: -0.00002845475368556284,
    trendLower: -0.00002845475368556284,
    trendUpper: -0.00002845475368556284
  }
];

const Dashboard = () => (
  <div>
    <CpuUtilizationChart data={data} />
    <GraphWidget title={'trend'} />
    <DayWiseWidget title={'trend'} />
    <TrendGraph title={'trend'} />
  </div>
);

export default Dashboard;
