// Task: Implement a class named 'RangeList'
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range list is an aggregate of these ranges: [1, 5), [10, 11), [100,201)

class RangeList {
    /**
     * A RangeList is an aggregate of integer ranges, each range is left inclusive and right exclusive, e.g. [1, 5)
     * The ranges are stored as a list of end points, where the odd elements are the lower bound of a range,
     *  and even elements are the upper bound.
     * */

    constructor() {
        this.endPoints = [];
    }

    /**
     * Validate input parameter is an array of two integers
     * @param {Array<number>} range
     * @return {void}
     */
    isValidRange( range ) {
        if ( !Array.isArray( range )
            || range.length !== 2
            || isNaN( range[ 0 ] )
            || isNaN( range[ 1 ] )
        ) {
            throw 'Range needs to be a pair of integers.';
        }
    }

    /**
     * This function is a simplified translation of python bisect.bisect_left
     * It aim to find a insertion index in this.endPoints for the parameter x
     * such that all elements to the left of the index will be smaller than x
     * @param {number} x - new number to insert
     * @return {number} - index to insert
     */
    bisectEndPointsLeft(x ) {
        // Validate input
        if ( isNaN( x ) ) {
            throw 'Parameter is not a number!';
        }

        let mid,
            lo = 0,
            hi = this.endPoints.length;

        while ( lo < hi ) {
            mid = Math.floor(( lo + hi ) / 2 );
            if ( this.endPoints[ mid ] < x ) {
                lo = mid + 1;
            }
            else {
                hi = mid;
            }
        }
        return lo;
    }

    /**
     * This function is a simplified translation of python bisect.bisect_right
     * It aim to find a insertion index in this.endPoints for the parameter x
     * such that all elements to the left of the index will be smaller than or equal to x
     * @param {number} x - new number to insert
     * @return {number} - index to insert
     */
    bisectEndPointsRight(x ) {
        // Validate input
        if ( isNaN( x ) ) {
            throw 'Parameter is not a number!';
        }

        let mid,
            lo = 0,
            hi = this.endPoints.length;

        while ( lo < hi ) {
            mid = Math.floor(( lo + hi ) / 2 );
            if (x < this.endPoints[ mid ]) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        return lo;
    }

    /**
     * This function replace this.endPoints[left:right] with elements in newRange
     * @param {Array<number>} newRange - Array of 1 or 2 integers that specify new range to add.
     * @param {number} left - first index to be replaced, inclusive
     * @param {number} right - last index to be replaced, exclusive
     * @return {void}
    */
    replaceWithNewRange( newRange, left,  right) {
        if ( isNaN(left) || isNaN(right) ) {
            throw 'Parameter is not a number!';
        }

        switch ( newRange.length ) {
            case 0:
                break;
            case 1:
                this.endPoints.splice(left, right - left, newRange[0]);
                break;
            case 2:
                this.endPoints.splice(left, right - left, newRange[0], newRange[1]);
                break;
            default:
                throw 'Unexpected array length!';
        }
    }

    /**
     * Adds a range to the RangeList
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     * @return {void}
     */
    add( range) {
        // Validate input
        this.isValidRange( range );

        // Find out the index to insert the new range
        let left = this.bisectEndPointsLeft( range[ 0 ] );
        let right = this.bisectEndPointsRight( range[ 1 ] );

        let newRange = [];
        // if the index we retrieved is even, it's outside of current ranges
        if ( left % 2 === 0 ) {
            newRange.push( range[ 0 ] );
        }
        if ( right % 2 === 0 ) {
            newRange.push( range[ 1 ] );
        }

         // replace this.endPoints[left:right] with elements in newRange
        this.replaceWithNewRange( newRange, left, right );
    }

    /**
     * Removes a range from the RangeList
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     * @return {void}
     */
    remove( range) {
        // Validate input
        this.isValidRange( range );

        // Find out the index to insert the new range
        let left = this.bisectEndPointsLeft( range [ 0 ] );
        let right = this.bisectEndPointsRight( range[ 1 ] );

        let newRange = [];
        // if the index we retrieved is odd, it's inside of current ranges
        if ( left % 2 === 1 ) {
            newRange.push( range[ 0 ] );
        }
        if ( right % 2 === 1 ) {
            newRange.push( range[ 1 ] );
        }

        // replace this.endPoints[left:right] with elements in newRange
        this.replaceWithNewRange( newRange, left, right );
    }

    /**
     * Construct the string representation as [a, b) [c d)
     * @return {String}
     * */
    toString() {
        let ret = this.endPoints.map((point, index) => {
            if ( index % 2 === 0 ) {
                return " [" + point.toString() + ", ";
            }
            else {
                return point.toString() + ") ";
            }
        })
        return ret.join( ' ' ) ;
    }

    /**
     * Prints out the ranges of ranges in the range ranges
     *  @return {void}
     */
    print() {
        console.log( this.toString() );
    }
}

// Example run
const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)