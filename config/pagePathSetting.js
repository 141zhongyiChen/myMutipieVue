let singlePageSettingDefault = {
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  },
  chunksSortMode: 'dependency'
}

/**
 *@functionName: pagePathSetting.js
 *@desc 以下开始为 配置项
 *@return
 *@date 2018/10/29 11:31:48
 */

let singlePage = false;
let childMuilpage = true;
let path = {
  // 相对于资源的位置
  default: './'
};
let staticSetting = {
  // 指定 static 文件夹的位置， 一般情况下 static 和 页面 会是同一个等级的文件夹下
  // 如果是相对位置，则是相对于 config 文件夹的位置 ./../dist
  // 如果是全路径，则按照全路径进行
  staticPath: './../dist',
  // 指定资源文件夹的名称
  staticPathName: 'static',
  // 指定的 static 文件被引用时的路径， 如果 static 和 页面 放在一起， 则使用 ./
  // staticUsingName: './../../',
  staticUsingName: './'
}

// proSetting
let proSetting = {
  path,
  staticSetting,
  singlePage: singlePage,
  childMuilpage: childMuilpage,
  single: {
    // 相对于 config 文件夹， html 文件的地址（输出 html 文件的全路径）
    // ./../dist/index.html
    fileName: './../dist/index.html',
    // 相对于跟路径的地址
    template: './src/index.html',
    app: './src/main.js'
  }
};
/**
 *@desc 配置项到此为止
 *@date 2018/10/29 13:45:02
 */

// devSetting
let devSetting = {
  path,
  staticSetting,
  childMuilpage: childMuilpage,
  single: {
    template: './src/index.html',
    app: './src/main.js'
  }
};

module.exports = {
  staticPath: staticSetting.staticPath,
  staticPathName: staticSetting.staticPathName,
  staticUsingName: staticSetting.staticUsingName,
  path,
  singlePage: singlePage,
  // 相对于根路径的 main.js 路径
  // ./src/main.js
  singlePageAppDev: devSetting.single.app,
  singlePageAppPro: proSetting.single.app,
  singlePageSettingPro: Object.assign({}, singlePageSettingDefault, {
    fileName: proSetting.single.fileName,
    template: proSetting.single.template
  }),
  singleHtmlPluginDev: Object.assign({}, singlePageSettingDefault, {
    template: devSetting.single.template
  }),
  // 是否 page 文件夹下的 文件配置多页输出
  childMuilpage: childMuilpage,
  // 当配置了文件夹下为多页输出后使用该方法导出 多页 HTML
  childMutilHTMLOutput(filePath, PAGE_PATH) {
    let filenames = filePath.substring(PAGE_PATH.length).split('/');
    filenames.shift();
    filenames.splice(filenames.length - 2, 1);
    filenames[filenames.length - 1] = filenames[filenames.length - 1].substring(0,filenames[filenames.length - 1].lastIndexOf('.html'));
    return {
      // 模板来源
      template: filePath,
      // 文件名称
      // filename: filenames.join('/') + '.html',
      filename: filenames[filenames.length - 1] + '.html',
      // 页面模板需要加载对应的js脚本， 如果不加这行，则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filenames.join('.')],
      // chunks: ['manifest', 'vendor', filename],
      inject: true
    };
  },
  // 默认情况下使用该方法导出单页 HTML
  singleHTMLOutput(filePath) {
    let filename = filePath.substring(filePath.lastIndexof('\/') + 1, filePath.lastIndexOf('.'));
    return {
      // 模板来源
      template: filePath,
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true
    }
  },
  // 当配置了文件夹下文件为多页输出后使用该方法指定多页的入口 JS
  childMutilEntry(entryFiles,PAGE_PATH) {
    let map = {};
    entryFiles.forEach((filePath) => {
      let filenames = filePath.substring(PAGE_PATH.length).split('/');
      filenames.shift();
      filenames.splice(filenames.length - 2,1);
      filenames[filenames.length - 1] = filenames[filenames.length - 1].substring(0,filenames[filenames.length - 1].lastIndexOf('.js'));
      map[filenames.join('.')] = filePath
    });
    return map;
  },
  // 默认情况下使用该方法指定 JS
  singleEntry(entryFiles,PAGE_PATH) {
    let map = {};
    entryFiles.forEach((filePath) => {
      var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
      map[filename] = filePath
    });
    return map;
  }
};
