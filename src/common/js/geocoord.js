let geoCoordMap = { // 地图地点的经度纬度
  '北京': [116.3979471, 39.9081726],
  '上海': [121.4692688, 31.2381763],
  '天津': [117.2523808, 39.1038561],
  '重庆': [106.548425, 29.5549144],
  '河北': [114.4897766, 38.0451279],
  '山西': [112.5223053, 37.8357424],
  '辽宁': [123.4116821, 41.7966156],
  '吉林': [125.3154297, 43.8925629],
  '黑龙江': [126.6433411, 45.7414932],
  '浙江': [120.1592484, 30.265995],
  '福建': [119.2978134, 26.0785904],
  '山东': [117.0056, 36.6670723],
  '河南': [113.6500473, 34.7570343],
  '湖北': [114.2919388, 30.5675144],
  '湖南': [112.9812698, 28.2008247],
  '广东': [113.2614288, 23.1189117],
  '海南': [110.3465118, 20.0317936],
  '四川': [104.0817566, 30.6610565],
  '贵州': [106.7113724, 26.5768738],
  '云南': [102.704567, 25.0438442],
  '江西': [115.8999176, 28.6759911],
  '陕西': [108.949028, 34.2616844],
  '青海': [101.7874527, 36.6094475],
  '甘肃': [103.7500534, 36.0680389],
  '广西': [108.3117676, 22.8065434],
  '新疆': [87.6061172, 43.7909393],
  '内蒙古': [111.6632996, 40.8209419],
  '西藏': [91.1320496, 29.657589],
  '宁夏': [106.2719421, 38.4680099],
  '台湾': [120.9581316, 23.8516062],
  '香港': [114.139452, 22.391577],
  '澳门': [113.5678411, 22.167654],
  '安徽': [117.2757034, 31.8632545],
  '江苏': [118.7727814, 32.0476151],
  '东莞': [113.8953, 22.901],
  '东营': [118.7073, 37.5513],
  '中山': [113.4229, 22.478],
  '临汾': [111.4783, 36.1615],
  '临沂': [118.3118, 35.2936],
  '丹东': [124.541, 40.4242],
  '丽水': [119.5642, 28.1854],
  '乌鲁木齐': [87.9236, 43.5883],
  '佛山': [112.8955, 23.1097],
  '保定': [115.0488, 39.0948],
  '兰州': [103.5901, 36.3043],
  '包头': [110.3467, 41.4899],
  '北海': [109.314, 21.6211],
  '南京': [118.8062, 31.9208],
  '南宁': [108.479, 23.1152],
  '南昌': [116.0046, 28.6633],
  '南通': [121.1023, 32.1625],
  '厦门': [118.1689, 24.6478],
  '台州': [121.1353, 28.6688],
  '合肥': [117.29, 32.0581],
  '呼和浩特': [111.4124, 40.4901],
  '咸阳': [108.4131, 34.8706],
  '哈尔滨': [127.9688, 45.368],
  '唐山': [118.4766, 39.6826],
  '嘉兴': [120.9155, 30.6354],
  '大同': [113.7854, 39.8035],
  '大连': [122.2229, 39.4409],
  '太原': [112.3352, 37.9413],
  '威海': [121.9482, 37.1393],
  '宁波': [121.5967, 29.6466],
  '宝鸡': [107.1826, 34.3433],
  '宿迁': [118.5535, 33.7775],
  '常州': [119.4543, 31.5582],
  '广州': [113.5107, 23.2196],
  '廊坊': [116.521, 39.0509],
  '延安': [109.1052, 36.4252],
  '张家口': [115.1477, 40.8527],
  '徐州': [117.5208, 34.3268],
  '德州': [116.6858, 37.2107],
  '惠州': [114.6204, 23.1647],
  '成都': [103.9526, 30.7617],
  '扬州': [119.4653, 32.8162],
  '承德': [117.5757, 41.4075],
  '拉萨': [91.1865, 30.1465],
  '无锡': [120.3442, 31.5527],
  '日照': [119.2786, 35.5023],
  '昆明': [102.9199, 25.4663],
  '杭州': [119.5313, 29.8773],
  '枣庄': [117.323, 34.8926],
  '柳州': [109.3799, 24.9774],
  '株洲': [113.5327, 27.0319],
  '武汉': [114.3896, 30.6628],
  '汕头': [117.1692, 23.3405],
  '江门': [112.6318, 22.1484],
  '沈阳': [123.1238, 42.1216],
  '沧州': [116.8286, 38.2104],
  '河源': [114.917, 23.9722],
  '泉州': [118.3228, 25.1147],
  '泰安': [117.0264, 36.0516],
  '泰州': [120.0586, 32.5525],
  '济南': [117.1582, 36.8701],
  '济宁': [116.8286, 35.3375],
  '海口': [110.3893, 19.8516],
  '淄博': [118.0371, 36.6064],
  '淮安': [118.927, 33.4039],
  '深圳': [114.5435, 22.5439],
  '清远': [112.9175, 24.3292],
  '温州': [120.498, 27.8119],
  '渭南': [109.7864, 35.0299],
  '湖州': [119.8608, 30.7782],
  '湘潭': [112.5439, 27.7075],
  '滨州': [117.8174, 37.4963],
  '潍坊': [119.0918, 36.524],
  '烟台': [120.7397, 37.5128],
  '玉溪': [101.9312, 23.8898],
  '珠海': [113.7305, 22.1155],
  '盐城': [120.2234, 33.5577],
  '盘锦': [121.9482, 41.0449],
  '石家庄': [114.4995, 38.1006],
  '福州': [119.4543, 25.9222],
  '秦皇岛': [119.2126, 40.0232],
  '绍兴': [120.564, 29.7565],
  '聊城': [115.9167, 36.4032],
  '肇庆': [112.1265, 23.5822],
  '舟山': [122.2559, 30.2234],
  '苏州': [120.6519, 31.3989],
  '莱芜': [117.6526, 36.2714],
  '菏泽': [115.6201, 35.2057],
  '营口': [122.4316, 40.4297],
  '葫芦岛': [120.1575, 40.578],
  '衡水': [115.8838, 37.7161],
  '衢州': [118.6853, 28.8666],
  '西宁': [101.4038, 36.8207],
  '西安': [109.1162, 34.2004],
  '贵阳': [106.6992, 26.7682],
  '连云港': [119.1248, 34.552],
  '邢台': [114.8071, 37.2821],
  '邯郸': [114.4775, 36.535],
  '郑州': [113.4668, 34.6234],
  '鄂尔多斯': [108.9734, 39.2487],
  '金华': [120.0037, 29.1028],
  '铜川': [109.0393, 35.1947],
  '银川': [106.3586, 38.1775],
  '镇江': [119.4763, 31.9702],
  '长春': [125.8154, 44.2584],
  '长沙': [113.0823, 28.2568],
  '长治': [112.8625, 36.4746],
  '阳泉': [113.4778, 38.0951],
  '青岛': [120.4651, 36.3373],
  '韶关': [113.7964, 24.7028],
  '吐鲁番': [89.18596, 42.94244],
  '那曲': [92.05136, 31.47614],
  '吕梁': [111.15081, 37.51761],
  '伊春': [128.669, 47.72582],
  '呼伦贝尔': [119.73572, 49.21336],
  '嘉峪关': [98.33435281250001, 39.668377553435185],
  '汉中': [107.03194, 33.06784]
}
export {geoCoordMap}
