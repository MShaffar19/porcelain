﻿/*-----------------------------------------------------------------------------
| Copyright (c) 2014, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|----------------------------------------------------------------------------*/
module porcelain {

    /**
     * The absolute minimum allowed element size.
     */
    var MIN_ELEMENT_SIZE = new Size(0, 0);

    /**
     * The absolute maximimum allowed element size.
     */
    var MAX_ELEMENT_SIZE = new Size((1 << 16) - 1, (1 << 16) - 1);

    /**
     * The layout geometry class.
     *
     * A Geometry instance is used to procedurally control the geometry
     * of an absolutely positioned element. It should not typically be 
     * used in combination with CSS layout.
     *
     * @class
     */
    export class Geometry implements IBox, IRect {

        /**
         * Construct a new Geometry instance.
         */
        constructor(element: HTMLElement) {
            this._element = element;
            this._syncGeometry();
        }

        /**
         * Destroy the geometry and release the element reference.
         */
        destroy(): void {
            this._element = null;
        }

        /**
         * The left edge of the element. 
         * 
         * This is equivalent to `x`. Modifying this value will change
         * the width but will not change the right edge.
         */
        get left(): number {
            return this._rect.left;
        }

        set left(left: number) {
            var min = this._rect.right - this._maxSize.width;
            var max = this._rect.right - this._minSize.width;
            this._rect.left = Math.min(Math.max(min, left), max);
            this._syncGeometry()
        }

        /**
         * The top edge of the element.
         *
         * This is equivalent to `y`. Modifying this value will change
         * the height but will not change the bottom edge.
         */
        get top(): number {
            return this._rect.top;
        }

        set top(top: number) {
            var min = this._rect.bottom - this._maxSize.height;
            var max = this._rect.bottom - this._minSize.height;
            this._rect.top = Math.min(Math.max(min, top), max);
            this._syncGeometry()
        }

        /**
         * The right edge of the element. 
         * 
         * This is equivalent to `left + width`. Modifying this value
         * will change the width but will not change the left edge.
         */
        get right(): number {
            return this._rect.right;
        }

        set right(right: number) {
            var min = this._rect.left + this._minSize.width;
            var max = this._rect.left + this._maxSize.width;
            this._rect.right = Math.min(Math.max(min, right), max);
            this._syncGeometry();
        }

        /**
         * The bottom edge of the element. 
         * 
         * This is equivalent to `top + height`. Modifying this value
         * will change the height but will not change the bottom edge.
         */
        get bottom(): number {
            return this._rect.bottom;
        }

        set bottom(bottom: number) {
            var min = this._rect.top + this._minSize.height;
            var max = this._rect.top + this._maxSize.height;
            this._rect.bottom = Math.min(Math.max(min, bottom), max);
            this._syncGeometry();
        }

        /**
         * The X-coordinate of the element. 
         * 
         * This is equivalent to `left`. Modifying this value will
         * move the element but will not change its size.
         */
        get x(): number {
            return this._rect.x;
        }

        set x(x: number) {
            this._rect.x = x;
            this._syncGeometry();
        }

        /**
         * The Y-coordinate of the element. 
         * 
         * This is equivalent to `top`. Modifying this value will
         * move the element but will not change its size.
         */
        get y(): number {
            return this._rect.y;
        }

        set y(y: number) {
            this._rect.y = y;
            this._syncGeometry();
        }

        /**
         * The width of the element. 
         *
         * This is equivalent `right - left`. Modifying this value
         * will change the right edge.
         */
        get width(): number {
            return this._rect.width;
        }

        set width(width: number) {
            var min = this._minSize.width;
            var max = this._maxSize.width;
            this._rect.width = Math.min(Math.max(min, width), max);
            this._syncGeometry();
        }

        /**
         * The height of the element. 
         *
         * This is equivalent `bottom - top`. Modifying this value
         * will change the bottom edge.
         */
        get height(): number {
            return this._rect.height;
        }

        set height(height: number) {
            var min = this._minSize.height;
            var max = this._maxSize.height;
            this._rect.height = Math.min(Math.max(min, height), max);
            this._syncGeometry();
        }

        /**
         * The top left corner of the element.
         *
         * Modifying this value will change the width and height.
         */
        get topLeft(): IPoint {
            return { x: this._rect.left, y: this._rect.top };
        }

        set topLeft(point: IPoint) {
            var minX = this._rect.right - this._maxSize.width;
            var maxX = this._rect.right - this._minSize.width;
            var minY = this._rect.bottom - this._maxSize.height;
            var maxY = this._rect.bottom - this._minSize.height;
            var x = Math.min(Math.max(minX, point.x), maxX);
            var y = Math.min(Math.max(minY, point.y), maxY);
            this._rect.topLeft = { x: x, y: y };
            this._syncGeometry();
        }

        /**
         * The top right corner of the element.
         *
         * Modifying this value will change the width and height.
         */
        get topRight(): IPoint {
            return { x: this._rect.right, y: this._rect.top };
        }

        set topRight(point: IPoint) {
            var minX = this._rect.left + this._minSize.width;
            var maxX = this._rect.left + this._maxSize.width;
            var minY = this._rect.bottom - this._maxSize.height;
            var maxY = this._rect.bottom - this._minSize.height;
            var x = Math.min(Math.max(minX, point.x), maxX);
            var y = Math.min(Math.max(minY, point.y), maxY);
            this._rect.topRight = { x: x, y: y };
            this._syncGeometry();
        }

        /**
         * The bottom left corner of the element.
         *
         * Modifying this value will change the width and height.
         */
        get bottomLeft(): IPoint {
            return { x: this._rect.left, y: this._rect.bottom };
        }

        set bottomLeft(point: IPoint) {
            var minX = this._rect.right - this._maxSize.width;
            var maxX = this._rect.right - this._minSize.width;
            var minY = this._rect.top + this._minSize.height;
            var maxY = this._rect.top + this._maxSize.height;
            var x = Math.min(Math.max(minX, point.x), maxX);
            var y = Math.min(Math.max(minY, point.y), maxY);
            this._rect.bottomLeft = { x: x, y: y };
            this._syncGeometry();
        }

        /**
         * The bottom right corner of the element.
         *
         * Modifying this value will change the width and height.
         */
        get bottomRight(): IPoint {
            return { x: this._rect.right, y: this._rect.bottom };
        }

        set bottomRight(point: IPoint) {
            var minX = this._rect.left + this._minSize.width;
            var maxX = this._rect.left + this._maxSize.width;
            var minY = this._rect.top + this._minSize.height;
            var maxY = this._rect.top + this._maxSize.height;
            var x = Math.min(Math.max(minX, point.x), maxX);
            var y = Math.min(Math.max(minY, point.y), maxY);
            this._rect.bottomRight = { x: x, y: y };
            this._syncGeometry();
        }

        /**
         * The X and Y coordinates of the the element origin. 
         * 
         * This is equivalent to `topLeft`. Modifying this value will
         * move the element but will not change its size.
         */
        get pos(): IPoint {
            return this._rect.pos;
        }

        set pos(pos: IPoint) {
            this._rect.pos = pos;
            this._syncGeometry();
        }

        /**
         * The width and height of the element.
         *
         * Modifying this value will change the right and bottom edges.
         */
        get size(): ISize {
            return this._rect.size;
        }

        set size(size: ISize) {
            var minw = this._minSize.width;
            var minh = this._minSize.height;
            var maxw = this._maxSize.width;
            var maxh = this._maxSize.height;
            var w = Math.min(Math.max(minw, size.width), maxw);
            var h = Math.min(Math.max(minh, size.height), maxh);
            this._rect.size = { width: w, height: h };
            this._syncGeometry();
        }

        /**
         * The position and size of the element.
         */
        get rect(): IRect {
            return this._rect.rect;
        }

        set rect(rect: IRect) {
            var minw = this._minSize.width;
            var minh = this._minSize.height;
            var maxw = this._maxSize.width;
            var maxh = this._maxSize.height;
            var w = Math.min(Math.max(minw, rect.width), maxw);
            var h = Math.min(Math.max(minh, rect.height), maxh);
            this._rect.rect = { x: rect.x, y: rect.y, width: w, height: h };
            this._syncGeometry();
        }

        /**
         * The minimum allowed size of the element.
         *
         * Modifying this value will cause the element to resize if its
         * current size is less than the new minimum.
         */
        get minimumSize(): ISize {
            return this._minSize.size;
        }

        set minimumSize(size: ISize) {
            // XXX clip and update
            this._minSize = new Size(size);
        }

        /**
         * The maximum allowed size of the element.
         *
         * Modifying this value will cause the element to resize if its
         * current size is greater than the new maximum.
         */
        get maximumSize(): ISize {
            return this._maxSize.size;
        }

        set maximumSize(size: ISize) {
            // XXX clip and update
            this._maxSize = new Size(size);
        }

        /**
         * Synchronize the element geometry with the internal rect.
         *
         * @private
         */
        private _syncGeometry(): void {
            if (!this._element) {
                return;
            }
            var rect = this._rect;
            var style = this._element.style;
            style.left = rect.left + "px";
            style.top = rect.top + "px";
            style.width = rect.width + "px";
            style.height = rect.height + "px";
        }

        private _element: HTMLElement;
        private _rect: Rect = new Rect();
        private _minSize: Size = new Size(MIN_ELEMENT_SIZE);
        private _maxSize: Size = new Size(MAX_ELEMENT_SIZE);
    }

}
