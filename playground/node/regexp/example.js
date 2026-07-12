const { RegExpTest } = require("@code/business");

function matchPhone(data) {
  const storeMap = new Map([
    // 国内手机号
    [/^1[3-9]\d{9}$/, data],
    // 国内的座机号
    [/^0[0-9]{3,4}-?[1-9][0-9]{6,7}/, data],
    // 特殊号码
    [/110|119|120|12345/, data],
  ]);

  const store = new RegExpTest(storeMap);

  store.toTest();
}

matchPhone(["13787142690"]);
