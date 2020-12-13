package sample;

/**
 * @author lee
 * Arrays.sort를 사용하지 않은 오름차순
 */
public class AsceSort { 		
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		int[] array = {7,5,9,0,3,1,6,2,4,8};
		int temp = 0;
		for(int a : array) {
			for(int j=0; j<array.length-1; j++) {
				//앞의 값과 비교하여 swap
				if(array[j] > array[j+1]) {
					temp = array[j];
					array[j] = array[j+1];
					array[j+1] = temp;
				}
			}
		}
		
		for(int a : array) {
			System.out.println(a);
		}
		
	}	
}
