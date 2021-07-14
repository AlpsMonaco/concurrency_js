# concurrency_js
a js file that implement concurrency async operation which could limit concurrency nums.

usage :
```
C.add(asyncFuncPrototype,...args)
C.wait().then(()=>{console.log("all done")})
```
remember to resolve() in your async function other wise queue will be blocked.

default concurreny num is 5
```
C.setMaxRunning(10) to change concurrency num.
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
