package datatransformers;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class DemultiplyGenreDumper {

	public static void main(String[] args) {

		if (args.length < 3) {
			System.err.println("usage is for example DemultiplyCrewAndActorsDumper 5 20 5");
			System.err.println("first number is maxGenres, second is maxCrew and third number is maxActors");
			System.exit(-1);
		}

		int maxGenres = Integer.parseInt(args[0]);
		int maxCrew = Integer.parseInt(args[1]);
		int maxActors = Integer.parseInt(args[2]);

		DemultiplyGenreDumper dumper = new DemultiplyGenreDumper();

		File input = new File(new File(System.getProperty("user.dir")), "filmsDataSetWithID.csv");
		File output = new File(input.getParentFile(), "Rectangularized.csv");

		try {
			dumper.dumpWithDemultipliedCrew(input, output, maxGenres, maxCrew, maxActors);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public DemultiplyGenreDumper() {

	}

	private void dumpWithDemultipliedCrew(File input, File output, int maxGenres, int maxCrew, int maxActors)
			throws IOException {

		FileReader fr = new FileReader(input, StandardCharsets.UTF_8); // reads the file
		BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
		// StringBuffer sb = new StringBuffer(); // constructs a string buffer with no
		// characters

//		Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(output, false)));

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		Writer writer = new BufferedWriter(new OutputStreamWriter(baos));

		
		String line;
//		int iteration = 0;
		int count = 0;
		
		Set<String> genresSet = new HashSet();
		
		

		int[] countGenres = new int[15];
		for (int i = 0; i < countGenres.length; i++) {
			countGenres[i] = 0;
		}

		writer.write(constructHeaderLine(maxGenres, maxCrew, maxActors));

		while ((line = br.readLine()) != null) {

			try {
//				if (iteration == 0) {
//					iteration++;
//					continue;
//				}

				String[] lineSplitted = line.split(",");

				String rolesStr = "";
				String actorsStr = "";
				if (lineSplitted.length > 10) {
					rolesStr = lineSplitted[10];
					if (lineSplitted.length > 11) {
						actorsStr = lineSplitted[11];
					}
				}

				String[] splitRoles = rolesStr.split("\\|");
				String[] splitActors = actorsStr.split("\\|");

				String[] splitGenres = lineSplitted[5].split(" ");
				int nbGenres = splitGenres.length;
				countGenres[nbGenres]++;

				StringBuilder sb = new StringBuilder();
				for (int i = 0; i < 10; i++) {
					if (i != 6) {
						if (i > 0) {
							sb.append(',');
						}
						sb.append(lineSplitted[i]);
					}
				}

				
				String[] genres = new String[maxGenres];
				genres = Arrays.copyOf(splitGenres, maxGenres);
				
				for (int i = 0; i < splitGenres.length; i++) {
					genresSet.add(splitGenres[i]);
				}
				
				
				String[] crew = new String[maxCrew];
				crew = Arrays.copyOf(splitRoles, maxCrew);

				String[] actors = new String[maxActors];
				actors = Arrays.copyOf(splitActors, maxActors);

				
				for (int i = 0; i < genres.length; i++) {
					sb.append(',');
					sb.append(genres[i] == null ? "" : genres[i]);
				}
				
				for (int i = 0; i < crew.length; i++) {
					sb.append(',');
					sb.append(crew[i] == null ? "" : crew[i]);
				}

				for (int i = 0; i < actors.length; i++) {
					sb.append(',');
					sb.append(actors[i] == null ? "" : actors[i]);
				}

				sb.append("\r\n");

				writer.write(sb.toString());
				if (count % 1000 == 0) {
					// break;
					System.out.println(count + "\t\t" + sb.toString());
				}
				if ((count != 0) && (count % 100000 == 0)) {
					break;

					// System.out.println(count + "\t\t" + char2 + "\t\t" + lineSplitted[0]);
				}
				count++;
			} catch (Throwable t) {
				System.err.println("problem " + t.getClass().getName() + "\t\t" + t.getMessage());
			}
		}

		System.out.println("dump countGenres");
		for (int i = 0; i < countGenres.length; i++) {
			System.out.println(i + "\t\t" + countGenres[i]);
		}
		
		System.out.println("genresSet\t"+genresSet.size());
		for (String g : genresSet) {
			System.out.print(g+'|');
		}
		

		br.close();
		fr.close();
		writer.close();
	}

	private String constructHeaderLine(int maxGenres, int maxCrew, int maxActors) {
		StringBuilder sb = new StringBuilder();
		sb.append("Id,");
		sb.append("Title,");
		sb.append("Year,");
		sb.append("Code,");
		sb.append("Duration,");
		// sb.append("Genres,");
		sb.append("Studio,");
		sb.append("Budget,");
		sb.append("Result,");
		sb.append("Date");

		for (int i = 1; i <= maxGenres; i++) {
			sb.append(",");
			sb.append("Genre");
			if (i < 10) {
				// hypothesis : maxCrew < 100
				sb.append("0");
			}
			sb.append(i);

		}

		for (int i = 1; i <= maxCrew; i++) {
			sb.append(",");
			sb.append("Crew");
			if (i < 10) {
				// hypothesis : maxCrew < 100
				sb.append("0");
			}
			sb.append(i);
		}

		for (int i = 1; i <= maxActors; i++) {
			sb.append(",");
			sb.append("Actor");
			if (i < 10) {
				// hypothesis : maxActor < 100
				sb.append("0");
			}
			sb.append(i);
		}

		sb.append("\r\n");

		return sb.toString();
	}

}
