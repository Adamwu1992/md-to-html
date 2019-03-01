# markdown-to-html

## 关键语法

- 标题
  - 以`#`开始，连续`#`个数表示Heading等级，最多支持6个
  - `#`后，遇到空格，表示Heading Tag结束
  - 空格以后，遇到任意非空格、非换行的字符，表示Heading Content开始
  - 遇到换行字符，表示Heading Content结束

- 段落
  - 无特殊符号开头
  - 换行符表示一个段落结束
  - 双空格（或者更多）加换行符表示在本段落后加一个空行

- 强调
  - 被`*`或者`_`包括的内容表示斜体
  - 被`**`或者`__`包括的内容表示加粗
  - 被包括`***`、`___`、`**_`或者`__*`的内容表示斜体加粗
  - 关闭标签必须和开始标签对称

## 实例

- 标题
  ```markdown
  # Heading1
  ## Heading2
  ### Heading3
  #### Heading4
  ##### Heading5
  ###### Heading6

  Heading1
  =

  Heading2
  -
  ```
  转化为
  ```html
  <h1>Heading1</h1>
  <h2>Heading2</h2>
  <h3>Heading3</h3>
  <h4>Heading4</h4>
  <h5>Heading5</h5>
  <h6>Heading6</h6>

  <h1>Heading1</h1>
  
  <h2>Heading2</h2>
  ```

- 段落
  ```markdown
  this line is end with two whitespace  
  hello world
  I love you.
  ```
  转化为
  ```html
  <p>this line is end with two whitespace</p>
  <br/>
  <p>hello world</p>
  <p>I love you.</p>
  ```