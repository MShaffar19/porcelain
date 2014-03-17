﻿/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
module porcelain {

    export class Size implements ISize {

        width: number;
        height: number;

        constructor();
        constructor(size: ISize);
        constructor(width: number, height: number);
        constructor(first?, second?) {
            switch (arguments.length) {
                case 0:
                    this.width = -1;
                    this.height = -1;
                    break;
                case 1:
                    var size = <ISize>first;
                    this.width = size.width;
                    this.height = size.height;
                    break;
                case 2:
                    var width = <number>first;
                    var height = <number>second;
                    this.width = width;
                    this.height = height;
                    break;
                default:
                    throw "invalid constructor call";
            }
        }

        get size(): ISize {
            return { width: this.width, height: this.height };
        }

        set size(size: ISize) {
            this.width = size.width;
            this.height = size.height;
        }

        isEmpty(): boolean {
            return this.width == 0 || this.height == 0;
        }

        isNull(): boolean {
            return this.width == 0 && this.height == 0;
        }

        isValid(): boolean {
            return this.width >= 0 && this.height >= 0;
        }

        boundedTo(other: ISize): Size {
            var w = Math.min(this.width, other.width);
            var h = Math.min(this.height, other.height);
            return new Size(w, h);
        }

        expandedTo(other: ISize): Size {
            var w = Math.max(this.width, other.width);
            var h = Math.max(this.height, other.height);
            return new Size(w, h);
        }

        transpose(): void {
            var temp = this.width;
            this.width = this.height;
            this.height = temp;
        }

        transposed(): Size {
            return new Size(this.height, this.width);
        }

        equals(other: ISize): boolean {
            return this.width == other.width && this.height == other.height;
        }

        add(other: ISize): void {
            this.width += other.width;
            this.height += other.height;
        }

        added(other: ISize): Size {
            var w = this.width + other.width;
            var h = this.height + other.height;
            return new Size(w, h);
        }

        subtract(other: ISize): void {
            this.width -= other.width;
            this.height -= other.height;
        }

        subtracted(other: ISize): Size {
            var w = this.width - other.width;
            var h = this.height - other.height;
            return new Size(w, h);
        }

        multiply(factor: number): void {
            this.width *= factor;
            this.height *= factor;
        }

        multiplied(factor: number): Size {
            var w = this.width * factor;
            var h = this.height * factor;
            return new Size(w, h);
        }

        divide(factor: number): void {
            this.width = Math.floor(this.width / factor);
            this.height = Math.floor(this.height / factor);
        }

        divided(factor: number): Size {
            var w = Math.floor(this.width / factor);
            var h = Math.floor(this.height / factor);
            return new Size(w, h);
        }
    }

}