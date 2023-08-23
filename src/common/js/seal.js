/* eslint-disable no-self-assign */
export const createSeal = (id, name, audit, time) => {
  var canvas = document.getElementById(id);
  var context = canvas.getContext('2d');

  // 清空画布
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.width;
  canvas.height = canvas.height;

  // 绘制印章边框
  var width = canvas.width / 2;
  var height = canvas.height / 2;
  context.lineWidth = 5;
  context.strokeStyle = '#2d8cf0';
  context.beginPath();
  context.arc(width, height, 85, 0, Math.PI * 2);
  context.stroke();

  // 绘制印章内框
  context.lineWidth = 2;
  context.strokeStyle = '#2d8cf0';
  context.beginPath();
  context.arc(width, height, 50, 0, Math.PI * 2);
  context.stroke();

  // 绘制印章内框
  context.lineWidth = 1;
  context.strokeStyle = '#2d8cf0';
  context.beginPath();
  context.arc(width, height, 46, 0, Math.PI * 2);
  context.stroke();

  // 绘制印章名称
  context.font = 'bolder 20px Helvetica';
  context.textBaseline = 'middle'; // 设置文本的垂直对齐方式
  context.textAlign = 'center'; // 设置文本的水平对对齐方式
  context.lineWidth = 1;
  context.fillStyle = '#2d8cf0';
  if (audit !== '') {
    context.fillText(name, width, height - 15);
    context.fillText(audit, width, height + 15);
  } else {
    context.fillText(name, width, height);
  }

  // 绘制印章时间
  context.font = '12px Helvetica';
  context.textBaseline = 'middle'; // 设置文本的垂直对齐方式
  context.textAlign = 'center'; // 设置文本的水平对对齐方式
  context.lineWidth = 1;
  context.fillStyle = '#2d8cf0';
  context.fillText(time.substring(0, 10), width, height + 60);

  context.font = '12px Helvetica';
  context.textBaseline = 'middle'; // 设置文本的垂直对齐方式
  context.textAlign = 'center'; // 设置文本的水平对对齐方式
  context.lineWidth = 1;
  context.fillStyle = '#2d8cf0';
  context.fillText(time.substring(10), width, height + 72);

  // 绘制五角星
  context.translate(width, height); // 平移到此位置
  var count = 10; // 五角星个数
  var angle = (4 * Math.PI) / (3 * (count - 1)); // 字间角度
  for (var i = 0; i < count; i++) {
    if (i === 0) {
      context.rotate((5 * Math.PI) / 6);
    } else {
      context.rotate(angle);
    }
    context.save();
    context.translate(68, 0); // 平移到此位置,此时字和x轴垂直
    context.rotate(Math.PI / 2); // 旋转90度,让字平行于x轴

    // 画五角星
    create5star(context, 8, '#2d8cf0');
    context.restore();
  }

  // 绘制五角星
  /**
   * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上
   * rotate:绕对称轴旋转rotate弧度
   */
  function create5star(context, radius, color) {
    context.fillStyle = color;
    context.beginPath(); // 创建路径
    var x = Math.sin(0);
    var y = Math.cos(0);
    var dig = (Math.PI / 5) * 4;
    for (var i = 0; i < 5; i++) {
      // 画五角星的五条边
      x = Math.sin(i * dig);
      y = Math.cos(i * dig);
      context.lineTo(x * radius, y * radius);
    }
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();
  }
};

// const createClassicSeal = (id, company, name, time) => {
//   var canvas = document.getElementById(id)
//   var context = canvas.getContext('2d')

//   // 清空画布
//   context.clearRect(0, 0, canvas.width, canvas.height)
//   canvas.width = canvas.width
//   canvas.height = canvas.height

//   // 绘制印章边框
//   var width = canvas.width / 2
//   var height = canvas.height / 2
//   context.lineWidth = 7
//   context.strokeStyle = '#2d8cf0'
//   context.beginPath()
//   context.arc(width, height, 85, 0, Math.PI * 2)
//   context.stroke()

//   // 画五角星
//   create5star(context, width, height, 18, '#2d8cf0', 0)

//   // 绘制印章名称
//   context.font = '18px Helvetica'
//   context.textBaseline = 'middle' // 设置文本的垂直对齐方式
//   context.textAlign = 'center' // 设置文本的水平对对齐方式
//   context.lineWidth = 1
//   context.fillStyle = '#2d8cf0'
//   context.fillText(name, width, height + 45)

//   // 绘制印章时间
//   context.font = '14px Helvetica'
//   context.textBaseline = 'middle' // 设置文本的垂直对齐方式
//   context.textAlign = 'center' // 设置文本的水平对对齐方式
//   context.lineWidth = 1
//   context.fillStyle = '#2d8cf0'
//   context.fillText(time, width, height + 65)

//   // 绘制印章单位
//   context.translate(width, height) // 平移到此位置
//   context.font = '20px Helvetica'
//   var count = company.length // 字数
//   var angle = 4 * Math.PI / (3 * (count - 1)) // 字间角度
//   var chars = company.split('')
//   var c
//   for (var i = 0; i < count; i++) {
//     c = chars[i] // 需要绘制的字符
//     if (i === 0) {
//       context.rotate(5 * Math.PI / 6)
//     } else {
//       context.rotate(angle)
//     }
//     context.save()
//     context.translate(90, 0) // 平移到此位置,此时字和x轴垂直
//     context.rotate(Math.PI / 2) // 旋转90度,让字平行于x轴
//     context.fillText(c, 0, 25) // 此点为字的中心点
//     context.restore()
//   }

//   // 绘制五角星
//   /**
//    * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上
//    * rotate:绕对称轴旋转rotate弧度
//    */
//   function create5star (context, sx, sy, radius, color, rotato) {
//     context.save()
//     context.fillStyle = color
//     context.translate(sx, sy) // 移动坐标原点
//     context.rotate(Math.PI + rotato) // 旋转
//     context.beginPath() // 创建路径
//     var x = Math.sin(0)
//     var y = Math.cos(0)
//     var dig = Math.PI / 5 * 4
//     for (var i = 0; i < 5; i++) { // 画五角星的五条边
//       x = Math.sin(i * dig)
//       y = Math.cos(i * dig)
//       context.lineTo(x * radius, y * radius)
//     }
//     context.closePath()
//     context.stroke()
//     context.fill()
//     context.restore()
//   }
// }
