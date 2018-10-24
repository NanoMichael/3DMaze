//@ts-check

'use strict'

function Maze(w, h, d) {
    if (w % 2 == 0) w += 1;
    if (h % 2 == 0) h += 1;
    if (d % 2 == 0) d += 1;

    this.width = w < 3 ? 3 : w;
    this.height = h < 3 ? 3 : h;
    this.depth = d < 3 ? 3 : d;

    this.map = (function (width, height, depth) {
        var arr = [];
        for (var i = 0; i < depth + 2; i++) {
            var r = [];
            for (var j = 0; j < height + 2; j++) {
                var c = [];
                for (var k = 0; k < width + 2; k++) {
                    if (i == 0 || i == depth + 1
                        || j == 0 || j == height + 1
                        || k == 0 || k == width + 1) {
                        c[k] = 0;
                    } else {
                        c[k] = 1;
                    }
                }
                r[j] = c;
            }
            arr[i] = r;
        }

        function makeMaze(map, x, y, z) {
            var c = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

            for (var i = 0; i < 6; i++) {
                var n = Math.floor(Math.random() * 6);
                var t = c[i];
                c[i] = c[n];
                c[n] = t;
            }

            map[x][y][z] = 0;
            for (var i = 0; i < 6; i++) {
                var d = c[i];
                if (map[x + 2 * d[0]][y + 2 * d[1]][z + 2 * d[2]] == 1) {
                    map[x + d[0]][y + d[1]][z + d[2]] = 0;
                    makeMaze(map, x + 2 * d[0], y + 2 * d[1], z + 2 * d[2]);
                }
            }
        }

        makeMaze(arr, 2, 2, 2);

        return arr;
    })(this.width, this.height, this.depth);

    this.str = function () {
        var img = '';
        for (var i = 1; i < this.depth + 1; i++) {
            for (var j = 1; j < this.height + 1; j++) {
                for (var k = 1; k < this.width + 1; k++) {
                    if (this.map[i][j][k] == 0) img += '0';
                    else img += ' ';
                }
                img += '\n';
            }
            img += "\n";
        }
        return img;
    }
}
