package programmers;

import java.util.ArrayList;
import java.util.Arrays;
/**
 * @author lee
 * https://programmers.co.kr/learn/courses/30/lessons/42576
 * 완주하지 못한 선수
 * remove, add 사용하면 효율성에서 탈락
 */
class Solution {
    public static String solution(String[] participant, String[] completion) {
    	Arrays.sort(participant);
    	Arrays.sort(completion);
       	ArrayList<String> part = new ArrayList<String>(Arrays.asList(participant));
       	ArrayList<String> cmpl = new ArrayList<String>(Arrays.asList(completion));
       	
       	
       	int index = 0;  
       	while(true) {
       		if(!part.get(index).equals(cmpl.get(index))) {
       			//참가자의 마지막 부분 다를 때 
       			System.out.println("1");
       			return part.get(index);
       		}else if(index == cmpl.size()-1){
       			//참가자 마지막 부분 없을 때
            	System.out.println("2");
                return part.get(index+1);
            }
       		
       		
       		index++;
       	}
    }
}

public class Hash {
	public static void main(String[] args) {
		
		String[] participant = {"leo", "kiki", "eden"};
		String[] completion= {"eden", "kiki"}; 
	//	String[] participant= {"mislav", "stanko", "mislav", "ana"};
	//	String[] completion= {"stanko", "ana", "mislav"}; 
		System.out.println(Solution.solution(participant, completion));	
	}
}
