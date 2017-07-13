import Stat from '@wac/lotus-stat';


// 公共埋点方法
const dataStat = (evt, ...options) => {
    const { platform, deviceid}=window.__INIT_DATA__;
 
	Stat.send('stat', {
        evt,
        ...options,
        platform,
        deviceid
    });
}
export default dataStat;