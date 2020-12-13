package programmers;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * @author lee
 * 전화번호 목록
 * https://programmers.co.kr/learn/courses/30/lessons/42577
 */
class Solution2 {
    public static boolean solution(String[] phone_book) {
        Arrays.sort(phone_book);
        ArrayList<String> phone = new ArrayList<String>(Arrays.asList(phone_book));

   
        int index = 0;
        while(true) {
        	if(index == phone.size()-1) {
        		return true;
        	}else if(phone.get(index+1).contains(phone.get(0))) {
        		return false;
        	}

        	
      	index ++;
        }

    }
}


public class Hash2 {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//String[] phone_book = {"119", "97674223", "1195524421"};
		//String[] phone_book = {"123","456","789"};
		String[] phone_book = {"12","123","1235","567","88"};
		System.out.println(Solution2.solution(phone_book));
	}

}
