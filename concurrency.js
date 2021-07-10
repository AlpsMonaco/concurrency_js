// usage :
// C.add(asyncFuncProtype,...args)
// C.wait().then(()=>{console.log("all done")})
// asyncFuncProtype must be a async func,otherwise there might be uncentain error.
// look demo  for more detail.

const C = (function () {
    let maxRunning = 5
    let currentRunning = 0
    let result = []
    let iterator = {
        queue: [], cursor: -1,

        add: function (asyncFunc, ...args) {
            this.queue.push({ f: asyncFunc, args: args })
        },

        reset: function () {
            this.cursor = -1; this.queue = []
        },

        nextCursor: function () {
            let c = ++this.cursor
            if (c > iterator.queue.length - 1) {
                --this.cursor
                return null
            }

            return c
        },

        next: function () {
            let c = this.nextCursor()
            return c === null ? null : iterator.queue[c]
        },
    }

    async function work() {
        for (; ;) {
            let o = iterator.next()
            if (!o) return
            let answer = await o.f(...o.args)
            result.push({
                "args": o.args,
                "answer": answer
            })
        }
    }

    function worker() {
        work().then(() => {
            currentRunning--
            console.log("die")
        })
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

        // call C.reset() to init C's internal iterator.
        // It makes sure that a new batch of async tasks work normally.
        reset: function () {
            iterator.reset()
            result = []
        },

        getResult: function () {
            return result
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

    function timeToPush(t, ex = "") {
        setTimeout(() => {
            C.add(timeToPrint, t, ex)
        }, t)
    }

    setTimeout(() => {
        for (let i = 1; i < 100; i++) {
            let t = i
            C.add(timeToPush, t, "from 1")
        }
    }, 1000)

    setTimeout(() => {
        for (let i = 1; i < 100; i = i + 5) {
            let t = i
            C.add(timeToPush, t, "from 2")
        }
    }, 5000)

    setTimeout(() => {
        for (let i = 1; i < 100; i = i + 3) {
            let t = i
            C.add(timeToPush, t, "from 3")
        }
    }, 10000)

}

demo()
