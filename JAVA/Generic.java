package test;

import java.util.HashMap;

/**
 * @author lee
 * 클래스 내부에서 사용할 데이터 타입을 인스턴스 생성 시 지정해 줄 수 있음
 * @param <G>
 */
class staticTest<G>
{
	G info;
	HashMap<Integer, G> map1 = new HashMap<Integer, G>();

	HashMap<Integer, G> excute(G info)
	{
		map1.put(1, info);
		return map1;
	}
}

public class Generic
{
	public static void main(String[] args)
	{
		staticTest<String> test = new staticTest<String>();
		staticTest<Integer> test2 = new staticTest<Integer>();
		System.out.println(test.excute("test"));
      //  System.out.println(test2.excute("test"));// 에러발생
		System.out.println(test2.excute(1));
	}
}
