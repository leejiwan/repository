package test;



class staticTest
{
	static int num = 10;
	int num2 = 5;
	
	static void execute()
	{
		System.out.println("no instance");
	}

	void execute2()
	{
		System.out.println("instance");
	}

	
}

public class Static
{
	public static void main(String[] args)
	{
		staticTest numTest = new staticTest();
		staticTest numTest2 = new staticTest();
		numTest.num2++;
		numTest2.num2--;
		System.out.println("numTest::" + numTest.num2); //6
		System.out.println("numTest::" + numTest2.num2); //4
		
		
		staticTest.num++;
		System.out.println("no instance ::" + staticTest.num);// 11
		staticTest.num--;
		System.out.println("no instance ::" + staticTest.num);// 10
		//static 변수는 이미 메모리에 할당 된 상태이며 인스턴스가 변수를 공유한다
		
		
		staticTest.execute();
	//	staticTest.execute2(); //불가능
		//static 메소드는는 이미 메모리에 할당 된 상태이며 인스턴스를 따로 생성하지 않아도 접근이 가능

	}
}