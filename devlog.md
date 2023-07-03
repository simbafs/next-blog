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