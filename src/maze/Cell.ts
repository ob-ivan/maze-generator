export class Cell {
    private wallUp = true;
    private wallRight = true;
    private wallDown = true;
    private wallLeft = true;

    public removeWallUp() {
        this.wallUp = false;
    }

    public removeWallRight() {
        this.wallRight = false;
    }

    public removeWallDown() {
        this.wallDown = false;
    }

    public removeWallLeft() {
        this.wallLeft = false;
    }

    public canWalkUp() {
        return !this.wallUp;
    }

    public canWalkRight() {
        return !this.wallRight;
    }

    public canWalkDown() {
        return !this.wallDown;
    }

    public canWalkLeft() {
        return !this.wallLeft;
    }
}
