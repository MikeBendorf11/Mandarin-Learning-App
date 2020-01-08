onmessage = (e) => {
  console.log("received " + e.data)
  fetch(`https://mycorseverywhere.herokuapp.com/http://www.ichacha.net/m/${e.data}.html`).then(function (response) {
    return response.text();
  }).then(function (html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var section = doc.querySelector('.jkbox');
    var list = section.innerText.split('例句与用法更多例句：  下一页').join('')
    var engArr = list.match(/[a-zA-Z ,.]+/g)
    var hnzArr = list.match(/[^a-zA-Z ,.]+/g)
    if (engArr.length == hnzArr.length) {
      var results = { eng: [], hnz: [] }
      engArr.forEach((snt, i) => {
        results.eng.push(engArr[i])
        results.hnz.push(hnzArr[i])
      })
      console.log(results)
    } else console.log('lengths don\'t match')
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}

