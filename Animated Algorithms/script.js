if (typeof window !== 'undefined') {
  // Code that uses document object

  /* ---  BUBBLE SORT - takes the converted array as a parameter
          - finds the largest value
          - bumps it up one index postion at a time to the end (or before the next largest value)
          - repeats until complete

    1.  the first "for" loop iterates through the entire array (array.length) once each time it loops

        2.  the nested "for" loop iterates through the array minus one (array.length - 1) once each time it loops
            NOTE: one less becuase it's comparing two indexes at a time 
            (so the last index doesn't need to be comared to a non-existent +1 index)
            
            3.  starting with the 0 index, 
                the nested "if" statement compares one value of the array with the next (index + 1)
                and then swaps the two values if the first is larger than the second
                if the second value is higher, no change is made and the nexted "for" loop iterates again. 
                
                the function swaps the two values: 
                by declaring a variable to store the larger value in
                then declaring the smaller value as the new value of that index
                then finally declaring the new value of the +1 index as the value of the variable

        The result of one completed iteration of the nested "for" loop: 
        the largest value in the array will be moved to the end while leaving the order of the remaining values

    Then the first "for" loop causes the process to happen again 
    which will place the second largest value second to last in the array and so on as it repeats.

    The function then returns the rearranged array, sorted left to right, smallest to largest.

  const bubbleSort = (array) => {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - 1; j++) {
        if (array[j] > array[j + 1]) {
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  }

  /* ---  SELECTION SORT -  takes an array as an argument
          - finds the index for the lowest value
          - swaps that value with the value at the next index (starting at 0)
          - repeats, finding the index of the next lowest value and swapping that value with the one at the next index (i++)
    
    1.  the first "for" loop iterates through the entire array (array.length) once
        inside that loop, we establish a variable which we'll use to store the index of the lowest value in the next step

        2.  the nested "for" loop iterates through the entire array (array.length) once each time it loops
            but starts at the second index (j = i + 1) because it will compare to the minIndex
            and because the first time through the loop, the minIndex will be 0
            so, the first comparison will be of the values at index 0 and index 0 + 1
          
            3.  the nested "if" statement compares a value at the j index with the value at the minIndex
                if the value at the j index is lower, that index becomes the new minIndex 
                (remember the minIndex variable is storing the index NOT the value)

        once the nested "for" loop finds the index of the lowest value, we swap it with the value at the lowest index
        by creating a variable to store the value at the current loop value (i)
        then assigning the value from the minImdex to that index (starting at 0)
        then finally, assigning the stored value to the minIndex of the array.
        the RESULT of one completed loop of the nested "for" function:
        - the next lowest value will now be in the next lowest index position (starting at 0)

    the function then returns the new, ordered array.

  const selectionSort = (array) => {
    for (let i = 0; i < array.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        } else {
        }
      }
      const temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
      console.log("new array: " + array);
    }
    return array;
  }

  /* ---  INSERTION SORT - takes an array as an argument
          - removes a value from the array if it is out of order, 
          - shifts the contents of the array as needed to make room for the value
          - inserts the value into it's proper index
          - repeats until all values are sorted

    1.  the first "for" loop iterates through the entire array (array.length) once starting at index 1
        we assign a currValue variable to hold the value being tested (array[i])
        we assign a variable to control what index value to test against

        2.  the nested "while" loop checks to ensure our index is not less than 0 (no negative index values)
            and checks whether the value we are testing (currValue) is less than the value we're testing against (array[j])
            - since the index of the value we're testing (currValue) comes after the value we're testing against (array[j])
              if the number that came before (array[j]) is larger, we assign that value to the index of the currentValue (array[j+1])
            - then we decrement j (j--) 
            - then the "while" loop does that check again with the new j value
            NOTE: currValue will not change until the loop ends as the loop starts at the current value and works backwards 
                  testing against each of the values in the array that came before the currValue's original index.
    
    once the "while" loop is finished, we assign the value that we are testing (currValue) to the proper index within the array (array[j+1])
    the process repeats until all values are sorted
    the function returns the sorted array.


  const insertionSort = (array) => {
    for (let i = 1; i < array.length; i++) {
      const currValue = array[i];
      let j = i - 1;

      while (j >= 0 && array[j] > currValue) {
        console.log("Starting WHILE loop... " + " Value of j = " + j + ", IS the value of array[j]: " + array[j] + ", GREATER than the value of currValue: " + currValue);
        array[j + 1] = array[j];
        console.log("YES! Changed array[j+1] to: " + array[j + 1]);
        console.log("Which changes the current array to: " + array);
        j--;
        console.log("Let's test the previous index! New j = " + j);
      }

      array[j + 1] = currValue;
      console.log("Changed NEW array[j+1] to currValue of: " + currValue);
      console.log("new array = " + array);
    }
    return array;
  }
  */

























}