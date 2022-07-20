const app = {
	data() {
		return {
			width: 50,
			height: 50,
			grid: [[]],
			unvisited: [[]],
			examinationQueue: [],
			startX: -1,
			startY: -1,
			endX: -1,
			endY: -1,
			generatorLoop: false,
			photoMode: false,
			hueRotation: 0
		};
	},
	methods: {
		initGen() {
			if (this.generatorLoop !== false) {
				clearInterval(this.generatorLoop);
				this.generatorLoop = false;
			}
			this.grid = [...Array(this.width)].map(() =>
				[...Array(this.height)].map(() => {
					return { examined: false, classes: [] };
				})
			);
			this.unvisited = [...Array(this.width)].map(() =>
				[...Array(this.height)].map(() => true)
			);
			this.startX = ~~(Math.random() * this.width);
			this.startY = ~~(Math.random() * this.height);

			this.examinationQueue.push({ x: this.startX, y: this.startY });
			this.unvisited[this.startY][this.startX] = false;
			this.grid[this.startY][this.startX].classes.push("filled");
		},
		mazeGen() {
			this.generatorLoop = setInterval(() => {
				if (this.examinationQueue.length) {
					let here = this.examinationQueue.pop(),
						validNeighbors = [];
					this.grid[here.y][here.x].examined = true;

					if (here.x > 0 && this.unvisited[here.y][here.x - 1]) {
						validNeighbors.push({ x: here.x - 1, y: here.y });
					}
					if (here.x + 1 < this.width && this.unvisited[here.y][here.x + 1]) {
						validNeighbors.push({ x: here.x + 1, y: here.y });
					}
					if (here.y > 0 && this.unvisited[here.y - 1][here.x]) {
						validNeighbors.push({ x: here.x, y: here.y - 1 });
					}
					if (here.y + 1 < this.width && this.unvisited[here.y + 1][here.x]) {
						validNeighbors.push({ x: here.x, y: here.y + 1 });
					}

					if (validNeighbors.length) {
						let pickedNeighbor =
							validNeighbors[~~(Math.random() * validNeighbors.length)];
						this.examinationQueue.push(here);
						this.examinationQueue.push(pickedNeighbor);
						this.grid[pickedNeighbor.y][pickedNeighbor.x].classes.push("filled");
						this.grid[pickedNeighbor.y][pickedNeighbor.x].examined = true;

						if (here.y < pickedNeighbor.y) {
							this.unvisited[here.y + 1][here.x] = false;
							this.grid[here.y][here.x].classes.push("open-bottom");
							this.grid[here.y + 1][here.x].classes.push("open-top");
						} else if (here.y > pickedNeighbor.y) {
							this.unvisited[here.y - 1][here.x] = false;
							this.grid[here.y - 1][here.x].classes.push("open-bottom");
							this.grid[here.y][here.x].classes.push("open-top");
						} else if (here.x < pickedNeighbor.x) {
							this.unvisited[here.y][here.x + 1] = false;
							this.grid[here.y][here.x].classes.push("open-right");
							this.grid[here.y][here.x + 1].classes.push("open-left");
						} else if (here.x > pickedNeighbor.x) {
							this.unvisited[here.y][here.x - 1] = false;
							this.grid[here.y][here.x].classes.push("open-left");
							this.grid[here.y][here.x - 1].classes.push("open-right");
						}
					} else {
						this.grid[here.y][here.x].examined = false;
					}
				} else {
					clearInterval(this.generatorLoop);
				}
			}, 60);
		}
	},
	computed: {
		activeColor() {
			return `hsl(${this.hueRotation++ % 360}, 85%, 57%)`;
		}
	},
	mounted() {
		this.initGen();
		this.mazeGen();
		this.hueRotation = ~~(Math.random() * 360);
		setInterval(() => this.hueRotation++, 1000);
	}
};

Vue.createApp(app).mount("#app");