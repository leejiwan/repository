package java;

import javax.lang.model.util.Elements;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;


/**
 * @author lee
 * jsoup-1.13.1.jar
 * json-simple-1.1.1.jar
 * jsoup 은 html parse 라이브러리
 * Dom구조를 추적하여 원하는 정보를 찾아올 수 있다
 */
public class HtmlParsing {
	static JSONArray getATagValue(String str)
	{
		// content html parsing
		Document doc = Jsoup.parse(str);
		Elements aTag = doc.select("a");
		JSONArray jArray = new JSONArray();
		for (Element e : aTag)
		{ // a 태그 중 href 속성이 있는것만 돌려준다
			if (e.attr("href") != null)
			{
				JSONObject jObj = new JSONObject();
				jObj.put("href", e.attr("href"));
				jObj.put("text", e.text());
				jArray.add(jObj);
			}

		}
		return jArray;
	}
}
