// // const crypto = require("crypto");
// // const {
// //   validatePaymentVerification,
// // } = require("razorpay/dist/utils/razorpay-utils");
// const config = require("../config/payment.config");

// function randomGenerator(length, alphanumeric = true) {
//   var result = "";
//   var characters = "";
//   if (alphanumeric === true) {
//     characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   } else {
//     characters = "0123456789";
//   }
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

// function checkHash(orderId, razorpayPaymentId, razorpaySignature) {
//   const generatedHash = crypto
//     .createHmac("sha256", config.secret)
//     .update(`${orderId}|${razorpayPaymentId}`)
//     .digest("hex");

//   return generatedHash === razorpaySignature;
// }

// String.format = function (str, arr) {
//   var i = -1;
//   function callback(exp, p0, p1, p2, p3, p4) {
//     if (exp == "%%") return "%";
//     if (arr[++i] === undefined) return undefined;
//     exp = p2 ? parseInt(p2.substr(1)) : undefined;
//     var base = p3 ? parseInt(p3.substr(1)) : undefined;
//     var val;
//     switch (p4) {
//       case "s":
//         val = arr[i];
//         break;
//       case "c":
//         val = arr[i][0];
//         break;
//       case "f":
//         val = parseFloat(arr[i]).toFixed(exp);
//         break;
//       case "p":
//         val = parseFloat(arr[i]).toPrecision(exp);
//         break;
//       case "e":
//         val = parseFloat(arr[i]).toExponential(exp);
//         break;
//       case "x":
//         val = parseInt(arr[i]).toString(base ? base : 16);
//         break;
//       case "d":
//         val = parseFloat(
//           parseInt(arr[i], base ? base : 10).toPrecision(exp)
//         ).toFixed(0);
//         break;
//     }
//     val = typeof val == "object" ? JSON.stringify(val) : val.toString(base);
//     var sz = parseInt(p1); /* padding size */
//     var ch = p1 && p1[0] == "0" ? "0" : " "; /* isnull? */
//     while (val.length < sz)
//       val = p0 !== undefined ? val + ch : ch + val; /* isminus? */
//     return val;
//   }
//   var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
//   return str.replace(regex, callback);
// };

// String.prototype.$ = function () {
//   return String.format(this, Array.prototype.slice.call(arguments));
// };

// module.exports = {
//   randomGenerator,
//   checkHash,
// };
