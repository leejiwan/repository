package programmers;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;

/*
 * 3-1 거스름돈 최소 갯수
 */
class calculate {
	final int[] coin = {500, 100, 50, 10};
	int money;
	int cnt = 0;
	HashMap<Integer, Integer> result = new HashMap<Integer, Integer>();
	calculate(int money) {
		this.money = money;
	}
	
	int calculation() {
		if(money >= 10) {
			for(int i=0; i<coin.length; i++) {
				int n = 1;
				while(0 != money) {
					if(money == (coin[i] * n)) {
						money = money - coin[i] * n;
						result.put(coin[i], n);
						cnt += n;
						break;
					}else if(money < (coin[i] * n)) {
						money = money - coin[i] * (n-1);
						result.put(coin[i], n-1);
						cnt += n-1;
						break;
					}
					n++;
				}
			}
		}
		//result는 결과값 보기 위함
		return cnt;
	}
	
}
public class Greedy {
	public static void main(String[] args) {
		calculate calculate = new calculate(1500);
		System.out.println(calculate.calculation());
	}
}

