const Crane = {
    canvas: false,
    ctx: false,
    bufferCanvas: false,
    bufferCtx: false,
    crane: {
        craneX: 0,
        craneWidth: 10,
        craneHeight: 35,
        clawWidth: 70,
        clawHeight: 30,
        isGrabbing: false,
        targetX: 0,
        isMoving: false,
        clawSwing: 0,
        swingAmplitude: 2,
        swingFrequency: 0.005,
        swingAngle: 5,
        grabbedItemImage: null,
        isGrabbingDelayed: false
    },
    moveSpeed: 5,
    clawAnimationSpeed: 2,
    horizontalAnimationSpeed: 2,
    grabDuration: 1000,
    clawImage: null,
    clawUpImage: null,
    isMouseDown: false,
    buttonHold: {
        status: false,
        to: false
    },
    itemsWidth: 40,
    itemsHeight: 20,

    init() {
        this.canvas = $(CraneElement.selector)[0]
        this.ctx = this.canvas.getContext("2d")
        this.bufferCanvas = document.createElement("canvas")
        this.bufferCanvas.width = this.canvas.width
        this.bufferCanvas.height = this.canvas.height
        this.bufferCtx = this.bufferCanvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false
        this.bufferCtx.imageSmoothingEnabled = false
        this.crane.craneX = this.canvas.width / 2 - this.crane.craneWidth / 2
        this.crane.targetX = this.crane.craneX

        this.clawImage = new Image()
        this.clawImage.src = CraneElement.clawImage

        this.clawUpImage = new Image()
        this.clawUpImage.src = CraneElement.clawImage

        this.crane.grabbedItemImage = new Image()
        this.crane.grabbedItemImage.src = CraneElement.itemsImage

        $(this.clawImage).on("load", () => this.setCrane())
        $(this.crane.grabbedItemImage).on("load", () => this.setCrane())

        this.setBackground()
        this.addEventListeners()
        this.animateHorizontalMovement()
    },

    setBackground() {
        const image = new Image()
        image.src = CraneElement.glass
        $(image).on("load", () => {
            this.bufferCtx.drawImage(image, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height)
            this.ctx.drawImage(this.bufferCanvas, 0, 0)
        })

        const itemsImage = new Image()
        itemsImage.src = CraneElement.itemsImage

        $(itemsImage).on("load", () => {
            const canvasWidth = this.bufferCanvas.width
            const canvasHeight = this.bufferCanvas.height
            const halfHeight = canvasHeight / 2

            for (let i = 0; i < 100; i++) {
                const x = Math.random() * (canvasWidth - this.itemsWidth + 25)
                const y = Math.random() * (halfHeight - this.itemsHeight) + halfHeight

                this.bufferCtx.drawImage(itemsImage, x - 10, y + 10, this.itemsWidth || 10, this.itemsHeight || 10)
            }

            this.ctx.drawImage(this.bufferCanvas, 0, 0)

            $(this.bufferCanvas).css({
                zIndex: 9999,
            })
        })

    },

    setCrane(item = false, zonkGrabbedItem = false) {
        this.clearCanvas()
        if(item) {
            this.crane.grabbedItemImage = new Image()
            this.crane.grabbedItemImage.src = CraneElement.itemsImage
        }
        this.ctx.drawImage(this.bufferCanvas, 0, 0)
        this.ctx.fillStyle = "gray"
        this.ctx.fillRect(this.crane.craneX, 0, this.crane.craneWidth, this.crane.craneHeight)

        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(this.crane.craneX, 0, this.crane.craneWidth, this.crane.craneHeight)

        if (this.clawImage.complete || this.clawUpImage.complete) {
            const swingOffset = this.crane.isMoving
                ? Math.sin(Date.now() * this.crane.swingFrequency) * this.crane.swingAmplitude
                : 0
            const swingAngle = this.crane.isMoving
                ? Math.sin(Date.now() * this.crane.swingFrequency) * this.crane.swingAngle
                : 0

            const clawX = this.crane.craneX - this.crane.clawWidth / 2 + this.crane.craneWidth / 2 + swingOffset
            const clawY = this.crane.craneHeight - 5

            this.ctx.save()
            this.ctx.translate(clawX + this.crane.clawWidth / 2, clawY + this.crane.clawHeight / 2)
            this.ctx.rotate((swingAngle * Math.PI) / 180)

            const clawToUse = this.crane.isGrabbing ? this.clawUpImage : this.clawImage

            this.ctx.drawImage(
                clawToUse,
                -this.crane.clawWidth / 2,
                -this.crane.clawHeight / 2,
                this.crane.clawWidth,
                this.crane.clawHeight
            )

            if (!zonkGrabbedItem) {
                // Do not wait for server or response here, continue animation immediately
                if (!this.crane.isGrabbingDelayed && this.crane.grabbedItemImage.complete) {
                    if (this.crane.craneHeight > 99) {
                        this.crane.isGrabbingDelayed = true;
                        this.ctx.drawImage(
                            this.crane.grabbedItemImage,
                            -this.crane.clawWidth / 3.5,
                            this.crane.clawHeight / 500,
                            this.itemsWidth,
                            this.itemsHeight
                        );
                    }
                }

                if (this.crane.isGrabbingDelayed && this.crane.grabbedItemImage.complete) {
                    this.ctx.drawImage(
                        this.crane.grabbedItemImage,
                        -this.crane.clawWidth / 3.5,
                        this.crane.clawHeight / 500,
                        this.itemsWidth,
                        this.itemsHeight
                    );
                }
            } else {
                // If it's a zonk item, animate it differently but without waiting for response
                if (!this.crane.isGrabbingDelayed && this.crane.grabbedItemImage.complete) {
                    if (this.crane.craneHeight > 99) {
                        this.crane.isGrabbingDelayed = true;
                        this.crane.itemYPosition = 0;
                        this.crane.fallSpeed = 2;
                        this.crane.lastItemYPosition = this.crane.itemYPosition;

                        this.ctx.drawImage(
                            this.crane.grabbedItemImage,
                            -this.crane.clawWidth / 3.5,
                            this.crane.clawHeight / 500 + this.crane.itemYPosition,
                            this.itemsWidth,
                            this.itemsHeight
                        );
                    }
                }

                if (this.crane.isGrabbingDelayed && this.crane.grabbedItemImage.complete) {
                    if (this.crane.itemYPosition < this.crane.craneHeight - this.itemsHeight) {
                        this.crane.itemYPosition += this.crane.fallSpeed;

                        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

                        this.ctx.drawImage(
                            this.crane.grabbedItemImage,
                            -this.crane.clawWidth / 3.5,
                            this.crane.clawHeight / 500 + this.crane.itemYPosition,
                            this.itemsWidth,
                            this.itemsHeight
                        );

                        // Continue the fall animation
                        requestAnimationFrame(() => this.updateFallingItem());
                    }
                }
            }

            this.ctx.restore()
        }
    },

    updateFallingItem() {
        if (this.crane.itemYPosition < this.crane.craneHeight - this.itemsHeight) {
            this.crane.itemYPosition += this.crane.fallSpeed;

            // Clear canvas to redraw the new position of the falling item
            this.clearCanvas();

            // Redraw background and claw
            this.ctx.drawImage(this.bufferCanvas, 0, 0);
            this.setCrane();

            // Draw the falling item
            this.ctx.drawImage(
                this.crane.grabbedItemImage,
                -this.crane.clawWidth / 3.5,
                this.crane.clawHeight / 500 + this.crane.itemYPosition,
                this.itemsWidth,
                this.itemsHeight
            );

            // Request the next animation frame
            requestAnimationFrame(() => this.updateFallingItem());
        } else {
            // When the item reaches the ground, stop the falling animation
            // You can add further logic here to handle what happens when the item reaches the bottom
            this.crane.isGrabbingDelayed = false; // Reset the grabbing delay flag
        }
    },

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },

    // addEventListeners() {
    //     $(document).on("keydown", event => {
    //         if (event.key === "ArrowLeft") this.setTargetPosition(-this.moveSpeed)
    //         if (event.key === "ArrowRight") this.setTargetPosition(this.moveSpeed)
    //         if (event.key === "ArrowUp") this.moveCraneUp()
    //         if (event.key === "ArrowDown") this.moveCraneDown()
    //     })


    //     $("#moveLeft").on("click", () => this.setTargetPosition(-this.moveSpeed))
    //     $("#moveRight").on("click", () => this.setTargetPosition(this.moveSpeed))

    //     $("#moveLeft").on("mousedown", () => {
    //         this.buttonHold.status = true
    //         this.buttonHold.to = "left"
    //         this.continuousMove()
    //     })

    //     $("#moveRight").on("mousedown", () => {
    //         this.buttonHold.status = true
    //         this.buttonHold.to = "right"
    //         this.continuousMove()
    //     })

    //     $("#moveLeft").on("mouseup", () => this.stopMovement())
    //     $("#moveRight").on("mouseup", () => this.stopMovement())

    //     $("#grab").on("click", () => this.grab())
    // },

    addEventListeners() {
        $(document).on("keydown", event => {
            if (event.key === "ArrowLeft") this.setTargetPosition(-this.moveSpeed)
            if (event.key === "ArrowRight") this.setTargetPosition(this.moveSpeed)
            if (event.key === "ArrowUp") this.moveCraneUp()
            if (event.key === "ArrowDown") this.moveCraneDown()
        })

        // Left and Right button events
        $("#moveLeft").on("mousedown", () => {
            this.buttonHold.status = true
            this.buttonHold.to = "left"
            this.continuousMove()
        })

        $("#moveRight").on("mousedown", () => {
            this.buttonHold.status = true
            this.buttonHold.to = "right"
            this.continuousMove()
        })

        $("#moveLeft, #moveRight").on("mouseup mouseleave", () => this.stopMovement())

        // Up and Down button events
        $("#moveUp").on("mousedown", () => {
            this.buttonHold.status = true
            this.buttonHold.to = "up"
            this.continuousMove()
        })

        $("#moveDown").on("mousedown", () => {
            this.buttonHold.status = true
            this.buttonHold.to = "down"
            this.continuousMove()
        })

        $("#moveUp, #moveDown").on("mouseup mouseleave", () => this.stopMovement())

        $("#grab").on("click", () => this.grab())
    },

    moveCraneUp() {
        const targetHeight = Math.max(this.crane.craneHeight - 5, 35)
        this.animateCraneMovement(targetHeight, "up")
    },

    moveCraneDown() {
        const targetHeight = Math.min(this.crane.craneHeight + 5, 98)
        console.log(targetHeight)
        this.animateCraneMovement(targetHeight, "down")
    },

    animateCraneMovement(targetHeight, movement) {
        this.crane.isMoving = true

        const step = this.crane.craneHeight < targetHeight ? 1 : -1
        const animate = () => {
            if (Math.abs(this.crane.craneHeight - targetHeight) <= Math.abs(step)) {
                this.crane.craneHeight = targetHeight
                this.setCrane()
                return
            }

            this.crane.craneHeight += step
            this.setCrane()
            requestAnimationFrame(animate)
        }
        animate()

        if(movement === "down") {
            if(this.crane.craneHeight > 97) {
                this.shakeClaw()
            }
        }
    },

    shakeClaw() {
        let shakeTime = 0
        const shakeDuration = 500
        const shakeAmplitude = 5
        const shakeFrequency = 10

        const startTime = performance.now()

        const performShake = (currentTime) => {
            const elapsed = currentTime - startTime

            if (elapsed < shakeDuration) {
                const shakeOffset = Math.sin(elapsed / shakeFrequency) * shakeAmplitude
                this.crane.craneX += shakeOffset
                this.setCrane()
                requestAnimationFrame(performShake)
            } else {
                this.setCrane()
            }
        }

        requestAnimationFrame(performShake)
    },

    // continuousMove() {
    //     if (this.buttonHold.status) {
    //         const direction = this.buttonHold.to === "left" ? -this.moveSpeed : this.moveSpeed
    //         this.setTargetPosition(direction)

    //         this.buttonHold.interval = setInterval(() => {
    //             if (this.buttonHold.status) {
    //                 this.setTargetPosition(direction)
    //             } else {
    //                 clearInterval(this.buttonHold.interval)
    //             }
    //         }, 35)
    //     }
    // },

    continuousMove() {
        if (this.buttonHold.status) {
            let action;

            if (this.buttonHold.to === "left") {
                action = () => this.setTargetPosition(-this.moveSpeed);
            } else if (this.buttonHold.to === "right") {
                action = () => this.setTargetPosition(this.moveSpeed);
            } else if (this.buttonHold.to === "up") {
                action = () => this.moveCraneUp();
            } else if (this.buttonHold.to === "down") {
                action = () => this.moveCraneDown();
            }

            if (action) {
                action();
                this.buttonHold.interval = setInterval(() => {
                    if (this.buttonHold.status) {
                        action();
                        $(`#move${this.buttonHold.to.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                            return letter.toUpperCase();
                        })}`).find("img").attr("src", `/assets/images/crane/${this.buttonHold.to}_hold.png`)
                    } else {
                        clearInterval(this.buttonHold.interval);
                    }
                }, 35);
            }
        }
    },

    stopMovement() {
        if(this.buttonHold.to) {
            $(`#move${this.buttonHold.to.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            })}`).find("img").attr("src", `/assets/images/crane/${this.buttonHold.to}.png`)
        }
        this.buttonHold.status = false
        clearInterval(this.buttonHold.interval)
        this.crane.isMoving = false
    },

    setTargetPosition(deltaX) {
        const newX = this.crane.targetX + deltaX
        if (newX >= 0 && newX + this.crane.craneWidth <= this.canvas.width) {
            this.crane.targetX = newX
            this.crane.isMoving = true
        }
    },

    animateHorizontalMovement() {
        const move = () => {
            if (Math.abs(this.crane.targetX - this.crane.craneX) > this.horizontalAnimationSpeed) {
                this.crane.craneX += (this.crane.targetX > this.crane.craneX ? 1 : -1) * this.horizontalAnimationSpeed
                this.crane.isMoving = true
            } else {
                this.crane.isMoving = false
            }
            this.setCrane()
            requestAnimationFrame(move)
        }
        move()
    },

    grab() {
        if (this.crane.isGrabbing) return

        $("#moveLeft").prop("disabled", true)
        $("#moveRight").prop("disabled", true)

        this.crane.isGrabbing = true
        this.crane.isGrabbingDelayed = false
        const targetHeight = this.canvas.height - this.crane.clawHeight - 20
        const startHeight = this.crane.craneHeight
        const duration = this.grabDuration
        const startTime = performance.now()

        const animateGrab = (time) => {
            const elapsed = time - startTime
            const progress = Math.min(elapsed / duration, 1)

            const easeOutQuad = progress => 1 - (1 - progress) * (1 - progress)
            this.crane.craneHeight = startHeight + (targetHeight - startHeight) * easeOutQuad(progress)

            this.setCrane()

            if (progress < 1) {
                requestAnimationFrame(animateGrab)
            } else {
                CraneElement.serverSide(Crane, (status) => {
                    if(status === "zonk") {
                        this.release(true, true)
                    } else {
                        this.release(false, false)
                    }
                })
            }
        }

        requestAnimationFrame(animateGrab)
    },

    release(item = false, zonk = false) {
        const targetHeight = 50
        const startHeight = this.crane.craneHeight
        const duration = this.grabDuration
        const startTime = performance.now()

        const animateRelease = (time) => {
            const elapsed = time - startTime
            const progress = Math.min(elapsed / duration, 1)

            const easeInQuad = progress => progress * progress
            this.crane.craneHeight = startHeight - (startHeight - targetHeight) * easeInQuad(progress)

            this.setCrane(item, zonk)

            if (progress < 1) {
                requestAnimationFrame(animateRelease)
            } else {
                this.crane.isGrabbing = false
                $("#moveLeft").prop("disabled", false)
                $("#moveRight").prop("disabled", false)
                this.resetCrane(item)
            }
        }

        requestAnimationFrame(animateRelease)
    },

    resetCrane(item = false) {
        this.crane.craneHeight = 40
        this.crane.targetX = this.canvas.width / 2 - this.crane.craneWidth / 2
        this.crane.isMoving = false
        this.crane.isGrabbing = false
        if(item) {
            this.crane.grabbedItemImage = false
            this.crane.isGrabbingDelayed = false
            // this.init()
            // this.crane.grabbedItemImage = new Image()
            // this.crane.grabbedItemImage.src = CraneElement.itemsImage
        }
        this.setCrane(item)
    },
}

$(document).ready(() => Crane.init())
