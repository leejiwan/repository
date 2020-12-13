package sample;

/**
 * @author lee
 * 내림차순
 */
public class DescSort {
	public static void main(String[] args) {
		final int[] array = {3,15,27,12};
		int temp = 0;
		for(int a : array) {
			for(int i=0; i<array.length-1; i++) {
				if(array[i] < array[i+1]) {
					temp = array[i];
					array[i] = array[i+1];
					array[i+1] = temp;
				}
			}
		}
		
		for(int a : array) {
			System.out.println(a);
		}
		
	}
}
