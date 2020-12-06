package programmers;

import java.util.HashMap;
/*
 * 숫자카드 게임, P96
 */
class calculate2 {
	int m;
	int n;
	int[][] input;
	HashMap<Integer, Integer> result = new HashMap<Integer, Integer>(); 
	calculate2() {
		
	}
	
	calculate2(int[][] input) {
		this.m = input.length; //가로
		this.n = input[0].length; //세로
		this.input = input;
	}
	
	int execute() {
		for(int i=0; i<m; i++) {
			int min = 0;
			for(int j=0; j<n; j++) {
				if(j == 0) {
					//첫 값을 무조건 넣어줌
					min = input[i][j];
				}else if(min > input[i][j]) {
					//최소면 바꾼다
					min = input[i][j];
				}
			}
			result.put(i, min);
		}
		int max = 0;
		for(int i=0; i< result.size(); i++) {
			if(i == 0) {
				max = result.get(i);
			}else if(max < result.get(i)) {
				max = result.get(i);
			}
		}
		return max;
	}
}

public class greedy2 {
	public static void main(String[] args) {
		int[][] array = {{7,3,1,8},{3,3,3,4}};
		calculate2 calculate2 = new calculate2(array);
		System.out.println(calculate2.execute());
	}
}
