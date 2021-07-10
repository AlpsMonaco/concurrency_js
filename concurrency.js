// usage :
// C.add(asyncFuncProtype,...args)
// C.wait().then(()=>{console.log("all done")})
// asyncFuncProtype must be a async func,otherwise there might be uncentain error.
// look demo  for more detail.

const C = (function () {
    let maxRunning = 5
    let currentRunning = 0
    let iterator = {
        queue: [], cursor: -1,

        add: function (asyncFunc, ...args) {
            this.queue.push({ f: asyncFunc, args: args })
        },

        reset: function () {
            this.cursor = -1; this.queue = []
        },

        next: function () {
            return ++this.cursor > iterator.queue.length - 1 ? null : iterator.queue[this.cursor]
        },
    }

    async function work() {
        for (; ;) {
            let o = iterator.next()
            if (!o) return
            await o.f(...o.args)
        }
    }

    function worker() {
        work().then(() => {
            currentRunning--
            console.log("die")
        })
        // setTimeout(() => {
        //     let o = iterator.next()
        //     if (!o) {
        //         currentRunning--
        //         console.log("die")
        //         return
        //     }

        //     o.f(...o.args).then((...args) => {
        //         worker()
        //     }).catch((e) => { console.error(e) })
        // }, 100)
    }

    function newJob() {
        if (currentRunning >= maxRunning) return
        console.log("new Worker")
        currentRunning++
        worker()
    }

    return {
        // add async function and args.
        // 
        add: function (asyncFunc, ...args) {
            iterator.add(asyncFunc, ...args)
            newJob()
        },
        wait: async function () {
            for (; ;) {
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve()
                    }, 1000)
                })

                if (currentRunning == 0) {
                    break
                }
            }
        },

        // call C.reset() before starting a new batch of async tasks if there are multi concurrency operations in the same time.
        reset: function () {
            iterator.reset()
        },

        // set max concurrency
        setMaxRunning: function (num) {
            maxRunning = num
        },

        isDone: function () {
            return currentRunning == 0
        }
    }
})()


function demo() {
    function timeToPrint(t, ex = "") {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(t, ex)
                resolve()
            }, t)
        })
    }

    setTimeout(() => {
        for (let i = 1; i < 10000; i++) {
            let t = i
            C.add(timeToPrint, t, "from 1")
        }
    }, 1000)

    setTimeout(() => {
        for (let i = 1; i < 10000; i = i + 5) {
            let t = i
            C.add(timeToPrint, t, "from 2")
        }
    }, 1000)

    setTimeout(() => {
        for (let i = 1; i < 10000; i = i + 3) {
            let t = i
            C.add(timeToPrint, t, "from 3")
        }
    }, 1000)

}

demo()
