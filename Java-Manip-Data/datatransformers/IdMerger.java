package datatransformers;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class IdMerger {

//	class IdAndMatchState {
//		String id;
//		boolean matchState;
//	}

	class MapYearAndTitleToId {
		int size = 0;

		private Map<String, Map<String, String>> mapExact, mapFuzzy;

		public MapYearAndTitleToId() {
			mapExact = new HashMap<>();
			mapFuzzy = new HashMap<>();
			// put("1977", "¡Bruja más que bruja!", "tt0074250");
		}

		void put(String year, String title, String id) {
			putToMap(mapExact, year, title, id);
			putToMap(mapFuzzy, year, flatten(title), id);
			size++;
		}

		private void putToMap(Map<String, Map<String, String>> map, String year, String title, String id) {
			Map<String, String> dataYear = map.get(year);
			if (dataYear == null) {
				dataYear = new HashMap<String, String>();
				dataYear.put(title, id);
				map.put(year, dataYear);
			} else {
				dataYear.put(title, id);
			}
		}

		int getSize() {
			return size;
		}

		String flatten(String decoratedTitle) {
			StringBuffer res = new StringBuffer();
			for (int i = 0; i < decoratedTitle.length(); i++) {
				char c = decoratedTitle.charAt(i);
				if (c >= 'a' && c <= 'z') {
					res.append(c);
				}
				if (c >= 'A' && c <= 'Z') {
					res.append(Character.toLowerCase(c));
				}
			}
			return res.toString();
		}

		String getId(String year, String title) {

			String res = get(mapExact, year, title);
			if (res == null) {
				String titleFuzz = flatten(title);
				res = get(mapFuzzy, year, titleFuzz);
				if (res != null) {
					res = res.replace("tt", "t?");
				}
			}
			return res;

//			if (id == null) {
//				return null;
//				// return "tt???????";
////				throw new NullPointerException("no id for " + year + "\t\t" + title);
//			} else {
//				return id;
//			}
		}

		private String get(Map<String, Map<String, String>> map, String year, String title) {
			String id = null;
			Map<String, String> dataYear = map.get(year);
			if (dataYear != null) {
				id = dataYear.get(title);
//				return id;
			} else {
//				return null;
			}
			return id;
		}
	}
//	class Characteristic {
//		String title;
//		int year;
//
//		public String toString() {
//
//			return (title.length() > 9 ? title.substring(0, 10) + "... " : title) + year;
//		}
//	}

	public static void main(String[] args) {
		if (args.length >= 1 && args[0].equalsIgnoreCase("test")) {
			test();
			System.exit(0);
		}

		IdMerger idMerger = new IdMerger();
		File fileTSV = new File(new File(System.getProperty("user.dir")),"data.tsv");
		try {
			MapYearAndTitleToId mapTitleAndYearToId = idMerger.walkTSV(fileTSV);
			// System.out.println(mapTitleAndYearToId);
			System.out.println(mapTitleAndYearToId.getSize());

			File fileDataSetCSV = new File(new File(System.getProperty("user.dir")), "filmsDataSet.csv");
			File enriched = new File(new File(System.getProperty("user.dir")), "filmsDataSetWithID.csv");
			idMerger.enrich(fileDataSetCSV, enriched, mapTitleAndYearToId);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private static void test() {
		String[] splitColNameAndYear = splitColNameAndYear("Kate & Leopold (2001)");
		System.out.println(splitColNameAndYear[0]);
		System.out.println(splitColNameAndYear[1]);
		System.out.println(reformatDate("Tue Dec 25 00:00:00 CET 2001", "1997"));
		System.out.println(reformatRoles(
				"Guy Hamilton : Director///Alistair MacLean : Writer///Robin Chapman : Writer///Carl Foreman : Writer///Oliver A. Unger : Producer///Ron Goodwin : Composer///Christopher Challis : Cinematographer///Raymond Poulton : Editor///Geoffrey Drake : Production Designer///"));
		System.out.println(reformatActors("Harrison Ford///Robert Shaw///Edward Fox///Franco Nero///"));
	}

	private void enrich(File fileDataSetCSV, File enriched, MapYearAndTitleToId mapTitleAndYearToId)
			throws IOException {

		FileReader fr = new FileReader(fileDataSetCSV, StandardCharsets.UTF_8); // reads the file
		BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
		// StringBuffer sb = new StringBuffer(); // constructs a string buffer with no
		// characters

		Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(enriched, true)));

		String line;
		int iteration = 0;
		int count = 0;

		int maxRolesNb = 0;
		int maxActorNb = 0;
		int noId = 0;

		while ((line = br.readLine()) != null) {

			try {
				if (iteration == 0) {
					iteration++;
					continue;
				}

				String[] lineSplitted = line.split(",");

				// col7 = date sample Tue Dec 25 00:00:00 CET 2001
				// col0 sample Kate & Leopold (2001)

				String[] col0Splitted = splitColNameAndYear(lineSplitted[0]);
				String reformatDate = reformatDate(lineSplitted[7], col0Splitted[1]);

//			Characteristic char2 = new Characteristic();
//			char2.title = col0Splitted[0];
//			char2.year = Integer.parseInt(col0Splitted[1]);

				String id = mapTitleAndYearToId.getId(col0Splitted[1], col0Splitted[0]);

				if (id == null) {
					noId++;

//					throw new NullPointerException("no id for " + col0Splitted[1] + "\t\t" + col0Splitted[0]);
					id = "tt????" + (noId < 100 ? "0" : "") + (noId < 10 ? "0" : "") + noId;
					System.err.println("warning : " + id + "\tno id for " + col0Splitted[1] + "\t\t" + col0Splitted[0]);
				}

//				sb.append(lineSplitted[0].toString());// appends line to string buffer
//				// sb.append(" ");
//				// sb.append(lineSplitted[2].toString());
//				sb.append("\n"); // line feed

				String reformatRoles = "";
				String reformatActors = "";
				if (lineSplitted.length >= 9) {
					reformatRoles = reformatRoles(lineSplitted[8]);
					if (lineSplitted.length >= 10) {
						reformatActors = reformatActors(lineSplitted[9]);
					}
				}

				String[] splitRoles = reformatRoles.split("|");
				if (splitRoles != null) {
					maxRolesNb = Integer.max(maxRolesNb, splitRoles.length);
				}

				String[] splitActors = reformatActors.split("|");
				if (splitActors != null) {
					maxActorNb = Integer.max(maxActorNb, splitActors.length);
				}

				StringBuilder sb = new StringBuilder();
				sb.append(id);
				sb.append(',');
				sb.append(col0Splitted[0]);
				sb.append(',');
				sb.append(col0Splitted[1]);
				for (int i = 1; i < lineSplitted.length; i++) {
					sb.append(',');
					switch (i) {
					case 7:
						sb.append(reformatDate);
						break;
					case 8:
						sb.append(reformatRoles);
						break;
					case 9:
						sb.append(reformatActors);
						break;

					default:
						sb.append(lineSplitted[i]);
					}

				}
				sb.append("\r\n");
				writer.write(sb.toString());

				if (count % 100 == 0) {
					// break;
					System.out.println(sb.toString());

					System.out.println(count + "\t\t" + line + "\r\n\t\t\t\t" + sb.toString());
				}
				if ((count != 0) && (count % 300000 == 0)) {
					break;

					// System.out.println(count + "\t\t" + char2 + "\t\t" + lineSplitted[0]);
				}
				count++;
			} catch (Throwable t) {
				System.err.println("problem " + t.getClass().getName() + "\t\t" + t.getMessage());
			}
		}
		System.out.println("maxRolesNb " + maxRolesNb);
		System.out.println("maxActorNb " + maxActorNb);
		System.out.println("noId " + noId);

		br.close();
		fr.close();
		writer.close();
	}

	private static String reformatRoles(String rolesStr) {
		String betterSplit = rolesStr.replace("///", "|");
		return betterSplit.substring(0, betterSplit.length() - 1);
	}

	private static String reformatActors(String actorsStr) {
		String betterSplit = actorsStr.replace("///", " : Actor|");
		return betterSplit.substring(0, betterSplit.length() - 1);
	}

	private static String reformatDate(String dateStr, String yearFromCol0) {

		if (dateStr.equals("null")) {
			return yearFromCol0 + "-04-26";
		}
		// sample Tue Dec 25 00:00:00 CET 2001
		// Date date = new Date(dateStr);
		// SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
//		return dateFormatter.format( dateTime.toLocalDate());

		DateTimeFormatter formatterI = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH);
		LocalDateTime dateTime = LocalDateTime.parse(dateStr, formatterI);

		// sample bad csv line about year
		// Crime Busters (1977),null,115,Action Adventure Comedy
		// Crime,null,null,33642,Thu Nov 03 00:00:00 CET 2016
		if (yearFromCol0 != Integer.toString(dateTime.getYear())) {
			dateTime = dateTime.withYear(Integer.parseInt(yearFromCol0));
		}

		// target 2012-04-23
		DateTimeFormatter formatterO = DateTimeFormatter.ofPattern("yyyy-MM-dd");
		return formatterO.format(dateTime.toLocalDate());

	}

	private static String[] splitColNameAndYear(String titleAndYear) {

		// sample Kate & Leopold (2001)
		String[] result = new String[2];
		result[0] = titleAndYear.substring(0, titleAndYear.length() - 7);
		result[1] = titleAndYear.substring(titleAndYear.length() - 5, titleAndYear.length() - 1);
		return result;

	}

	private MapYearAndTitleToId walkTSV(File file) throws IOException {

		MapYearAndTitleToId result = new MapYearAndTitleToId();

//			File file = new File("C:\\Users\\Gilles\\Documents\\BAC IT 2019-2020\\TFE\\files\\data.tsv"); // creates a new file instance
		FileReader fr = new FileReader(file); // reads the file
		BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
		// StringBuffer sb = new StringBuffer(); // constructs a string buffer with no
		// characters
		String line;
		int iteration = 0;
		int count = 0;

		while ((line = br.readLine()) != null) {
			if (iteration == 0) {
				iteration++;
				continue;
			}

			String[] lineSplitted = line.split("\\t");
			if (lineSplitted[5].toString().contains("N")) {
				continue;
			}
			int yearOfRelease = Integer.parseInt(lineSplitted[5]);
			if (lineSplitted[1].toString().contains("movie") && yearOfRelease > 1976 && yearOfRelease < 2019) {
				// if(yearOfRelease>1976&&yearOfRelease<1980) {

//				Characteristic char2 = new Characteristic();
//				char2.title = lineSplitted[2];
//				char2.year = yearOfRelease;
//
//				result.put(char2, lineSplitted[0]);

				result.put(lineSplitted[5], lineSplitted[2], lineSplitted[0]);

				// sb.append(lineSplitted[0].toString());// appends line to string buffer
//				// sb.append(" ");
//				// sb.append(lineSplitted[2].toString());
//				sb.append("\n"); // line feed

				if (count % 10000 == 0) {
					// break;
					System.out.println(
							count + "\t\t" + yearOfRelease + "\t\t" + lineSplitted[2] + "\t\t" + lineSplitted[0]);
				}
				count++;
			}
		}
		fr.close();
		return result;
	}

}
