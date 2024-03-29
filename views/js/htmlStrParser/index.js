let sign_enum = {
  SIGN_END: "SIGN_END", // 结束标签读取 如 </xxxxx>
  SIGN_END_OK: "SIGN_END_OK", // 结束标签读取完成
  SIGN_START: "SIGN_START", // 开始标签读取 如 <xxxxx>
  SIGN_START_OK: "SIGN_START_OK", // 开始标签读取完成
};
function htmlStrParser(htmlStr) {
  const str = htmlStr.replace(/\n/g, "");
  let result = { nodeName: "root", children: [] };
  // 默认 result.children[0]插入, ，这里记录调试用的栈信息
  let use_line = [0];
  let current_index = 0; // 记录当前插入children的下标
  let node = result; // 当前操作的节点
  let sign = ""; // 标记标签字符串（可能包含属性字符）、文本信息
  let status = ""; // 当前状态，为空的时候我们认为是在读取当前节点（node）的文本信息
  for (var i = 0; i < str.length; i++) {
    var current = str.charAt(i);
    var prev = str.charAt(i - 1);
    var next = str.charAt(i + 1);
    if (current === "<") {
      // 在开始标签完成后记录文本信息到当前节点
      if (sign && status === sign_enum.SIGN_START_OK) {
        node.text = sign;
        sign = "";
      }
      // 根据“</”来区分是 结束标签的（</xxx>）读取中  还是开始的标签(<xxx>) 读取中
      if (next === "/") {
        status = sign_enum.SIGN_END;
      } else {
        status = sign_enum.SIGN_START;
      }
    } else if (current === ">") {
      // (<xxx>) 读取中，遇到“>”， (<xxx>) 读取中完成
      if (status === sign_enum.SIGN_START) {
        // 记录当前node所在的位置，并更改node
        node = result;
        use_line.map((_, index) => {
          if (!node.children) node.children = [];
          if (index === use_line.length - 1) {
            console.log(1, sign);
            sign = sign.replace(/^\s*/g, "");
            // .replace(/(\"|')/g, "");
            console.log(2, sign);
            let mark = sign.match(/^[a-zA-Z0-9\-]*\s*/)[0].replace(/\s/g, ""); // 记录标签
            console.log(3, mark);
            // 标签上定义的属性获取
            let attributeStr = sign
              .replace(mark, "")
              .replace(/\s+/g, ",")
              .split(",");

            let attrbuteObj = {};
            let style = {};
            attributeStr.map((attr) => {
              if (attr) {
                let value = attr.split("=")[1];
                let key = attr.split("=")[0];
                if (key === "style") {
                  value.split(";").map((s) => {
                    if (s) {
                      style[s.split(":")[0]] = s.split(":")[1];
                    }
                  });
                  return (attrbuteObj[key] = style);
                }
                attrbuteObj[key] = value;
              }
            });
            node.children.push({
              nodeName: mark,
              children: [],
              ...attrbuteObj,
            });
          }
          current_index = node.children.length - 1;
          node = node.children[current_index];
        });
        use_line.push(current_index);
        sign = "";
        status = sign_enum.SIGN_START_OK;
      }
      if (prev === "/") {
        status = sign_enum.SIGN_END;
      }
      // (</xxx>) 读取中，遇到“>”， (</xxx>) 读取中完成
      if (status === sign_enum.SIGN_END) {
        use_line.pop();
        node = result;
        // 重新寻找操作的node
        use_line.map((i) => {
          node = node.children[i];
        });
        sign = "";
        status = sign_enum.SIGN_END_OK;
      }
    } else {
      sign = sign + current;
    }
  }
  return result;
}

const htmlStr = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column padding="15px" border="1px solid #000" inner-border="4px solid #0ff" padding-top="25px" background-color="#000" inner-background-color="#ff0" width="421px">
        <mj-divider></mj-divider>
        <mj-spacer height="50px" container-background-color="#f0f" />
        <mj-image width="300px" src="https://www.online-image-editor.com//styles/2014/images/example_image.png" padding="10px 15px" border="2px solid #000" rel="123" />
      </mj-column>
      <mj-column background-color="#000000">
        <mj-navbar base-url="https://mjml.io" hamburger="hamburger" ico-color="#ffffff">
          <mj-navbar-link href="/gettings-started-onboard" color="#ffffff">Getting started</mj-navbar-link>
          <mj-navbar-link href="/try-it-live" color="#ffffff" padding="35px">Try it live</mj-navbar-link>
          <mj-navbar-link href="/templates" color="#ffffff">Templates</mj-navbar-link>
          <mj-navbar-link href="/components" color="#ffffff">Components</mj-navbar-link>
        </mj-navbar>
        <mj-social font-size="16px" icon-size="30px" mode="horizontal" padding="5px 10px" container-background-color="#ff0" icon-size="55px">
          <mj-social-element name="facebook" href="https://mjml.io/" icon-size="65px">
          </mj-social-element>
            <mj-social-element name="google" href="https://mjml.io/" border-radius="16px">
              Google
            </mj-social-element>
            <mj-social-element  name="twitter" href="https://mjml.io/">
              Twitter
            </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
const htmlStr2 = `<html>
  <head></head>
  <body>
    <h1>我是标签</h1>
    <div>我是div标签</div>
    <span id="root" style='color:red' border="1px solid #000">我是span标签</span>
    <img />
    <span id="root" style="color:red">我是span标签</span>
  </body>
</html>`;
console.dir(htmlStrParser(htmlStr2));
