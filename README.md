# concurrency_js
a js file that implement concurrency async operation which could limit concurrency nums.

usage :
```
C.add(asyncFuncProtype,...args)
C.wait().then(()=>{console.log("all done")})
```

// look demo  for more detail.

```
function demo() {
    function timeToPrint(t) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(t)
                resolve()
            })
        })
    }

    setTimeout(() => {
        for (let i = 1; i < 100; i++) {
            let t = i
            C.add(timeToPrint, t)
        }
    }, 100)

    setTimeout(() => {
        for (let i = 1; i < 100; i = i + 5) {
            let t = i
            C.add(timeToPrint, t)
        }
    }, 2000)

    setTimeout(() => {
        for (let i = 1; i < 100; i = i + 3) {
            let t = i
            C.add(timeToPrint, t)
        }
    }, 5000)


    C.wait().then(() => {
        console.log("all done")
    })
}
```
