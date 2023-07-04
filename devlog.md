# 2023-07-01
今天加了 markdown 支援，remark 在 nextjs 和他官方 GitHub 兩個的範例長得不太一樣，最後我相信官方 GitHub 寫得  
另外稍微搞了一下 lighthouse，有幾相似乎不太可能改善，像是 input 必須加 label，但是那個位置不能放 lebel 阿。針對他抱怨的修改後分數是有上升，但還不到全部 100 分，搞這個還要兼顧網頁美觀好難喔。  
搞了 `open` 指令，以前都是直接拼出結果，現在是真的可以用了，不過我覺得我的整體規劃要在思考，因為現在 terminal 裡面開始變得混亂了，好像該把 pipe 等功能實做出來會比較舒服，另外 `ls`、`open` 指令牽扯到 fs 要怎麼搞還得想想，可能可以新增 `terminal.fs`，這樣這兩個指令就能正常運作了。
另外 tokenrize 的機制應該也要改進，`initCmd` 應該就能傳一個 `string` 就可以了，這樣就不用想奇怪的資料結構去表示含 `pipe` 的命令，雖然在 `Shell()` 裡面還是需要，我猜可以定義成這樣
```ts
type command = {
    current: string[]
    next?: string[]
    conjuncton?: 'pipe'
}
```
這樣以後還能支援 `&&`、`||`、`>` 和 `<`，不過 `for` 和 `$(cmd)` 等功能可能比較麻煩，但這還太複雜可能不會做吧

# 2023-07-02
今天幾乎把 terminal 重構，把 stdin 明確定義出來了，但是 fs 還沒，所以目前 `open`、`ls` 等指令不符合預期是正常的。現在一個指令輸入+輸出叫做一個 `<Cell />`，`Cell` 下有 `PS1`、`Input`、`Shell`，`PS1` 只是單純的 PS1，`Input` 會根據是否有給 `cmdIndex` 切換顯示之前的命令和一個輸入框，最後 `Shell` 會把指定 `cmdIndex` 的指令執行結果印出來。`shell` 裡的 `cmd` 也根據這次做出調整，首先是應該支援 pipe，還沒測試。然後 history 裡的值從 `string[]` 改成 `string`，需要的時候在丟進 `shell/tokenize` 切割。明天的任務是把 fs 實做出來，這樣 shell 就更完整了，至於 `&&`、`||` 這些看心情吧，不太需要。

# 2023-07-04
我在想，filesystem 需要哪些功能，首先是 `ls` 需要目前目錄下的檔案們，或是一個完整的檔案樹（只有檔名），然後如果現在是在檔案的話還要提供檔案內容，
```ts
type fs = {
    directory: tree.Node
    files?: string
}
```
這樣全塞會不會讓網頁變很肥阿，還是說只放一層的檔案就好了？或是說做一個開關？

我發現 `lib/tree` 有點怪怪的，包括路徑什麼的需要再細修，通用性不夠高，但今天懶得處理，之後再說吧

把 `ls` 搞定了！灑花！接下來要嘛把程式碼整理的更通用（像是 `lib/tree`），或是可以開始吧舊 blog 搬過來了。

開發陷入了瓶頸，有幾個問題
1. 圖片
因為我的檔案結構長這樣，
```
.
├── content
│   ├── asdf.ewrq
│   ├── index.md
│   └── post
│       ├── helloWorld2.md
│       ├── helloWorld.md
│       ├── markdown
│       │   ├── cat-yellow.png
│       │   └── index.md
│       └── test
│           └── hi.md
├── src
│   ├── pages
│   │   ├── 404.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   └── [...post].tsx
```
所以像是 `cat-yellow.png` 其實不會被 nextjs 放進 static files 裡面，也就是說我搞定了圖片相對路徑問題也還是無法搞定圖片顯示，除非我把他們放到 `public/` 目錄下，但是那樣好醜，而且我很多舊的文章都不是這個作法，等於是搬遷的時候會非常痛苦  
2. 輸出太大
開 dev tool 看了一下，都是首頁，nextjs 的總傳輸量是 6.66MB，而 hugo 只有 297.88kB，一個在本機一個不知道放在哪裡，兩個的載入速度是一樣的。  

真的好不想放棄現在的這個，但是基於以上原因好想放棄回去用 hugo，hugo 的話我只需要熟悉 golang tempalate 就跟研究出之前到底為什麼會 build 失敗可以自己做主題了，或是沿用現在這個也可以，現在這個主題其實很不錯。  
沒意外的話應該會先把這個 repo 封存，先搞定 hugo 吧。
