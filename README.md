## 指令说明

```bash

book-fetch.exe

book-fetch [command]

Commands:
  book-fetch.exe hafetch       下载hathitrust.org图书
  book-fetch.exe rhafetch      如果有失败记录(文件位于haFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe haconfig      生成配置文haconfig.json(文件位于haFiles/haconfig.toml)

  book-fetch.exe nlfetch       下载韩国国立图书馆藏(https://www.nl.go.kr/)书籍
  book-fetch.exe rnlfetch      如果有失败记录(文件位于nlFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe nlconfig      生成配置文nlconfig.json(文件位于nlFiles/nlconfig.toml)

  book-fetch.exe nlbookindex   下载old book类书目，书目下载保存到nlFiles/bookinde.md文件
  book-fetch.exe rnlbookindex  如果有失败记录(文件位于nlFiles/indexundownLoad.txt)则重新下载,每次操作完成后需要手动删除 历史记录,然后再下
  book-fetch.exe kofetchlist   查看下载详情
  book-fetch.exe kofetch       下载高丽大学图书馆(http://kostma.korea.ac.kr/)
  book-fetch.exe rkofetch      如果有失败记录(文件位于koFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe koconfig      生成配置文koconfig.json(文件位于koFiles/koconfig.toml)

  book-fetch.exe osfetch       下载巴伐利亞州立東亞圖書館(https://ostasien.digitale-sammlungen.de/)
  book-fetch.exe rosfetch      如果有失败记录(文件位于osFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe osfetchdpi    查看图片分辨率详情
  book-fetch.exe osconfig      生成配置文osconfig.json(文件位于osFiles/osconfig.toml)

  book-fetch.exe akfetch       下载韩国收藏阁(https://jsg.aks.ac.kr/)
  book-fetch.exe rakfetch      如果有失败记录(文件位于aksFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史 记录,然后再下
  book-fetch.exe akconfig      生成配置文akconfig.json(文件位于akFiles/akconfig.toml)

  book-fetch.exe akfetchdpi    查看图片分辨率详情
  book-fetch.exe rmfetch       下载京都大学(https://rmda.kulib.kyoto-u.ac.jp/)
  book-fetch.exe rrmfetch      如果有失败记录(文件位于aksFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史 记录,然后再下
  book-fetch.exe rmfetchdpi    查看图片分辨率详情
  book-fetch.exe rmconfig      生成配置文akconfig.json(文件位于rmFiles/rmconfig.toml)

  book-fetch.exe lofetch       美国国会图书馆(https://www.loc.gov/)
  book-fetch.exe rlofetch      如果有失败记录(文件位于loFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe lofetchlist   查看下载详情
  book-fetch.exe loconfig      生成配置文loconfig.json(文件位于rmFiles/loconfig.toml)

  book-fetch.exe lofetchdpi    查看图片分辨率详情
  book-fetch.exe difetch       德国柏林国立图书馆(https://digital.staatsbibliothek-berlin.de/)
  book-fetch.exe rdifetch      如果有失败记录(文件位于diFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe difetchdpi    查看图片分辨率详情
  book-fetch.exe diconfig      生成配置文diconfig.json(文件位于diFiles/diconfig.toml)

  book-fetch.exe harfetch      哈佛大学图书馆(https://curiosity.lib.harvard.edu/chinese-rare-books/catalog?search_field=all_fields)
  book-fetch.exe rharfetch     如果有失败记录(文件位于harFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史 记录,然后再下
  book-fetch.exe harfetchdpi   查看图片分辨率详情
  book-fetch.exe harconfig     生成配置文harconfig.json(文件位于harFiles/harconfig.toml)

  book-fetch.exe harbookindex  下载chinese-rubbings-collection书目下载保存到harFiles/bookindex.md文件
  book-fetch.exe wafetch       早稻田大学图馆(https://www.wul.waseda.ac.jp/kosho/)
  book-fetch.exe rwafetch      如果有失败记录(文件位于waFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe wafetchlist   查看下载详情
  book-fetch.exe waconfig      生成配置文waconfig.json(文件位于harFiles/waconfig.toml)

  book-fetch.exe prfetch       普林斯顿大学东亚图书馆(https://dpul.princeton.edu/eastasian)
  book-fetch.exe rprfetch      如果有失败记录(文件位于prFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe prfetchdpi    查看图片分辨率详情
  book-fetch.exe prfetchlist   查看下载详情
  book-fetch.exe prconfig      生成配置文prconfig.json(文件位于prFiles/prconfig.toml)

  book-fetch.exe bofetch       牛津大学博德利图书馆(https://digital.bodleian.ox.ac.uk/collections/chinese-digitization-project/)
  book-fetch.exe rbofetch      如果有失败记录(文件位于boFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe bofetchdpi    查看图片分辨率详情
  book-fetch.exe boconfig      boconfig.json(文件位于boFiles/boconfig.toml)

  book-fetch.exe shfetchlist   查看下载详情
  book-fetch.exe shfetch       东京大学图书馆(http://shanben.ioc.u-tokyo.ac.jp/)
  book-fetch.exe rshfetch      如果有失败记录(文件位于shFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe shconfig      生成配置文shconfig.json(文件位于shFiles/shconfig.toml)

  book-fetch.exe nifetch       日本古典书籍的唯一门户网站(https://kokusho.nijl.ac.jp/?ln=ja)
  book-fetch.exe nifetchdpi    查看图片分辨率详情
  book-fetch.exe nifetchlist   查看下载详情
  book-fetch.exe rnifetch      如果有失败记录(文件位于niFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe niconfig      生成配置文niconfig.json(文件位于niFiles/niconfig.toml)

  book-fetch.exe bnfetch       法国图书馆(https://gallica.bnf.fr/accueil/fr/content/accueil-fr?mode=desktop)
  book-fetch.exe bnfetchlist   查看下载详情
  book-fetch.exe rbnfetch      如果有失败记录(文件位于bnFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe bnconfig      生成配置文bnconfig.json(文件位于bnFiles/bnconfig.toml)

  book-fetch.exe anfetch       澳大利亚国立大学图书馆(https://openresearch-repository.anu.edu.au/handle/1885/9199)
  book-fetch.exe anfetchlist   查看下载详情
  book-fetch.exe anfetchdpi    查看图片分辨率详情
  book-fetch.exe ranfetch      如果有失败记录(文件位于anFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe anconfig      生成配置文anconfig.json(文件位于anFiles/anconfig.toml)

  book-fetch.exe anbookindex   下载澳大利亚国立大学图书馆中文书目下载保存到anFiles/bookindex.md文件
  book-fetch.exe nlafetch      澳大利亚国家图书馆(https://catalogue.nla.gov.au/catalog?f%5Baccess_ssim%5D%5B%5D=National+Library+%28digitised+item%29&f%5Blanguage_ssim%5D%5B%5D=Chinese&search_field=subject)
  book-fetch.exe rnlafetch     如果有失败记录(文件位于nlaFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史 记录,然后再下
  book-fetch.exe nlafetchlist  查看下载详情
  book-fetch.exe nlaconfig     生成配置文nlaconfig.json(文件位于nlaFiles/nlaconfig.toml)

  book-fetch.exe kafetch       日本关西大学(https://www.iiif.ku-orcas.kansai-u.ac.jp/open_platform/search?kywd=&title=&creator=&spatial=&temporal=&language=75157&type%5Bdb_books%5D=db_books&type%5Bhakuen_bu
                               nko%5D=hakuen_bunko&type%5Bosaka_gadan%5D=osaka_gadan&type%5Byinpu%5D=yinpu&f%5B0%5D=temporal%3A1901&page=1)
  book-fetch.exe kafetchlist   查看下载详情
  book-fetch.exe kafetchdpi    查看图片分辨率详情
  book-fetch.exe rkafetch      如果有失败记录(文件位于kaFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe kaconfig      生成配置文kaconfig.json(文件位于kaFiles/kaconfig.toml)

  book-fetch.exe wikifetch     維基共享(https://commons.wikimedia.org/wiki/Category:Scans_from_the_Seikado_Bunko_Library?uselang=zh-tw)
  book-fetch.exe rwikifetch    如果有失败记录(文件位于wikiFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下
  book-fetch.exe arcbookindex  下载日本内阁文库汉书书目下载保存到arcFiles/bookindex.md文件
  book-fetch.exe actionfetch   运行后端服务
  book-fetch.exe actionresult  查看记录
  book-fetch.exe actioncfg     生成配置文actionConfig.toml(文件位于gacFiles/actionConfig.toml)
  book-fetch.exe actionruncfg  读取当前目录actionRunConfig.toml配置(主要用于github action服务器使用,本地不需要使用)
  book-fetch.exe gshare        下载google云盘分享文件

Options:
  --help     Show help                                                                                                                                                                         [boolean]
  --version  Show version number                                                                                                                                                               [boolean]

Examples:
  hafetch使用说明:
  book-fetch.exe hafetch  -i hvd.32044067943118  -s 1 -e 305                                            下载示例说明
  book-fetch.exe rhafetch                                                                               重试示例说明
  book-fetch.exe haconfig                                                                               生成配置文件(位 于haFiles/rhaConfig.toml)

  韩国国立图书馆使用说明:
  book-fetch.exe nlfetch -c CNTS-00109637789 -v 1 -s 1 -e 3                                             nlfetch下载示例
  book-fetch.exe rnlfetch                                                                               rnlfetch下载示例
  book-fetch.exe nlconfig                                                                               生成配置文件(位 于nlFiles/nlConfig.toml)

  高丽大学图书馆使用说明:
  book-fetch.exe  kofetch -u RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244 -s 1 -e 57                   kofetch下载示例
  book-fetch.exe  kofetchlist -u RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244                          kofetchlist示例
  book-fetch.exe rkofetch                                                                               rkofetch重试示例
  book-fetch.exe koconfig                                                                               生成配置文件(位 于koFiles/koConfig.toml)

  巴伐利亞州立東亞圖書館使用说明:
  book-fetch.exe osfetch -i bsb11122602 -s 1 -e 2                                                       osfetch说明
  book-fetch.exe rosfetch                                                                               rosfetch示例
  book-fetch.exe osconfig                                                                               生成配置文件(位 于osFiles/osConfig.toml)

  韩国收藏阁使用说明:
  book-fetch.exe akfetch -u "https://jsg.aks.ac.kr/viewer/viewIMok?dataId=K3-427%7C001#node?depth=2&up  akfetch说明:url 需要加引号;-h -w参数可选
  Path=001&dataId=001" -s 1 -e 2  -h 100 -w 100
  book-fetch.exe rakfetch                                                                               rakfetch示例
  book-fetch.exe rmfetchdpi -u "https://jsg.aks.ac.kr/viewer/viewIMok?dataId=K3-427%7C001#node?depth=2  查看图片分辨率
  &upPath=001&dataId=001"
  book-fetch.exe akconfig                                                                               生成配置文件(位 于akFiles/akConfig.toml)

  京都大学图书馆使用说明:
  book-fetch.exe rmfetch -i rb00007972 -s 1 -e 2 -h 100 -w 100                                          rmfetch说明:-h -w参数可选
  book-fetch.exe rmfetchdpi -i rb00007972                                                               查看图片分辨率
  book-fetch.exe rrmkfetch                                                                              rrmfetch示例
  book-fetch.exe rmconfig                                                                               生成配置文件(位 于rmFiles/rmConfig.toml)

  谷歌云盘使用说明:
  book-fetch.exe gshare  -u "https://drive.google.com/file/d/1oIMIKhztjQXr-t6z19BAbJw5yFekLoJ4/view?us  gshare
  p=sharing"

  德国柏林国立图书馆使用说明:
  book-fetch.exe difetch -p PPN3303598916 -s 1 -e 2 -h 100 -w 100                                       difetch说明:-h -w参数可选
  book-fetch.exe difetchdpi -p PPN3303598916                                                            查看图片分辨率
  book-fetch.exe rdimkfetch                                                                             rdifetch示例
  book-fetch.exe diconfig                                                                               生成配置文件(位 于diFiles/diConfig.toml)

  哈佛大学图书馆使用说明:
  book-fetch.exe harfetch -u https://curiosity.lib.harvard.edu/chinese-rare-books/catalog/49-990032703  harfetch说明:-h -w参数可选
  120203941 -s 1 -e 2 -h 100 -w 100
  book-fetch.exe harfetchdpi -u https://curiosity.lib.harvard.edu/chinese-rare-books/catalog/49-990032  查看图片分辨率
  703120203941
  book-fetch.exe rharfetch                                                                              重试
  book-fetch.exe harconfig                                                                              生成配置文件(位 于harFiles/harConfig.toml)

  早稻田大学图书馆使用说明:
  book-fetch.exe wafetch -u https://archive.wul.waseda.ac.jp/kosho/chi06/chi06_03730/ -s 1 -e 2 -t pdf  wafetch说明:-t(pdf或html 默认pdf)

  book-fetch.exe wafetchlist -u https://archive.wul.waseda.ac.jp/kosho/chi06/chi06_03730/               查看pdf html分页详情
  book-fetch.exe rwafetch                                                                               重试
  普林斯顿大学东亚图书馆使用说明:
  book-fetch.exe prfetch -u https://dpul.princeton.edu/eastasian/catalog/gh93h668k  -s 1 -e 2  -w 100   prfetch说明:-w( 可选) -h(可选)
  -h 100
  book-fetch.exe bofetchdpi -u https://dpul.princeton.edu/eastasian/catalog/gh93h668k                   查看图片分辨率
  book-fetch.exe prfetchlist                                                                            查看列表详情
  book-fetch.exe rprfetch                                                                               重试
  book-fetch.exe prconfig                                                                               生成配置文件(位 于prFiles/prConfig.toml)

  牛津大学博德利图书馆使用说明:
  book-fetch.exe bofetch -i 5fb71c32-57a5-415a-868f-0ec6904838de -s 1 -e 2  -w 100 -h 100               bofetch说明:-w( 可选) -h(可选)
  book-fetch.exe bofetchdpi -i 5fb71c32-57a5-415a-868f-0ec6904838de                                     查看图片分辨率
  book-fetch.exe rbofetch                                                                               重试
  book-fetch.exe boconfig                                                                               生成配置文件(位 于boFiles/boConfig.toml)

  日本古典书籍的唯一门户网站:
  book-fetch.exe nifetch -i 100380752 -s 1 -e 2  -w 100 -h 100                                          bofetch说明:-w( 可选) -h(可选)
  book-fetch.exe nifetchlist                                                                            查看列表详情
  book-fetch.exe nifetchdpi -i 100380752                                                                查看图片分辨率
  book-fetch.exe rnifetch                                                                               重试
  book-fetch.exe niconfig                                                                               生成配置文件(位 于niFiles/niConfig.toml)

  法国图书馆:
  book-fetch.exe bnfetch -u https://gallica.bnf.fr/ark:/12148/btv1b52519915t -s 1 -e 1                  bofetch说明:
  book-fetch.exe bnfetchlist                                                                            查看列表详情
  book-fetch.exe rbnfetch                                                                               重试
  book-fetch.exe bnconfig                                                                               生成配置文件(位 于bnFiles/bnConfig.toml)

  澳大利亚国立大学图书馆:
  book-fetch.exe anfetch -u https://openresearch-repository.anu.edu.au/handle/1885/205926 -s 1 -e 1     bofetch说明:
  book-fetch.exe anfetchlist                                                                            查看列表详情
  book-fetch.exe ranfetch                                                                               重试
  book-fetch.exe anconfig                                                                               生成配置文件(位 于anFiles/anConfig.toml)

  澳大利亚国家图书馆:
  book-fetch.exe nlafetch -u https://catalogue.nla.gov.au/catalog/1920597 -s 1 -e 1 -w 100              bofetch说明:
  book-fetch.exe nlafetchlist                                                                           查看列表详情
  book-fetch.exe rnlafetch                                                                              重试
  book-fetch.exe nlaconfig                                                                              生成配置文件(位 于nlaFiles/nlaConfig.toml)

  日本关西大学
  book-fetch.exe kafetch -i 1136 -s 1 -e 1 -w 100                                                       bofetch说明:
  book-fetch.exe kafetchlist -i 1136                                                                    查看列表详情
  book-fetch.exe kafetchdpi -i 1136                                                                     查看图片分辨率
  book-fetch.exe rkafetch                                                                               重试
  book-fetch.exe kaconfig                                                                               生成配置文件(位 于kaFiles/kaConfig.toml)


copyright 2023 book-fetch

```