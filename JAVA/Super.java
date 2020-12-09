package test;

/**
 * @author lee
 *
 */
class car
{
	int engine = 3;
	int wheel = 2;
	String color = "gray";
	
	
	car() {
		
	}
	
	car(String color)
	{
		this.color = color;
	}
}

/**
 * @author lee
 *	Super
 */
class sonata extends car
{
	String color = "red";

	sonata() {
		
	}
	
	void excute() throws Exception
	{
		System.out.println(super.engine); //3
		System.out.println(super.wheel); //2
		System.out.println(this.color); //red
		System.out.println(super.color); //gray
		//super 키워드를 사용할 시 부모 클래스의 변수를 참조함
		//같은 변수같은 경우 String color의 경우는 자식 클래스의 지역변수를 출력함
	}
}


/**
 * @author lee
 * Super()
 */
class k5 extends car {
	k5()
	{
		super("green");
	}

	void excute() throws Exception
	{
		System.out.println(this.color); //green
		System.out.println(this.engine); //3
		System.out.println(this.wheel); //2
		//super()  부모 클래스 변수 초기화
	}

}


public class Super
{
	public static void main(String[] args) throws Exception
	{
		sonata s = new sonata();
		s.excute();
		
		k5 k5 = new k5();
		k5.excute();
	}
}