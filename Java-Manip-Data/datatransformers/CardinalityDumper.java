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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class CardinalityDumper {

	class IdAndStats {

		String id;
		int nbRoles;
		int nbActors;

		@Override
		public String toString() {
			return "IdAndStats [id=" + id + ", nbRoles=" + nbRoles + ", nbActors=" + nbActors + "]";
		}
	}

	public class MyComparator implements Comparator<IdAndStats> {
		boolean sortActor;

		public MyComparator(boolean sortActor) {
			this.sortActor = sortActor;
		}

		@Override
		public int compare(IdAndStats o1, IdAndStats o2) {
			if (sortActor) {
				return -Integer.compare(o1.nbActors, o2.nbActors);
			} else {
				return -Integer.compare(o1.nbRoles, o2.nbRoles);
			}
		}

	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		CardinalityDumper dumper = new CardinalityDumper();

		File enriched = new File(new File(System.getProperty("user.dir")), "filmsDataSetWithID.csv");
		File fileRoles = new File(new File(System.getProperty("user.dir")), "filmsDataSet_Roles.csv");
		File fileActors = new File(new File(System.getProperty("user.dir")), "filmsDataSet_Actors.csv");

		try {
			dumper.dumpCardinalities(enriched, fileRoles, fileActors);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public CardinalityDumper() {

	}

	private void dumpCardinalities(File enriched, File roles, File actor) throws IOException {

		FileReader fr = new FileReader(enriched, StandardCharsets.UTF_8); // reads the file
		BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
		// StringBuffer sb = new StringBuffer(); // constructs a string buffer with no
		// characters

		Writer writerRoles = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(roles, true)));
		Writer writerActor = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(actor, true)));

		String line;
//		int iteration = 0;
		int count = 0;
		int countMissingCol = 0;

		List<IdAndStats> listStats = new ArrayList<>();

		while ((line = br.readLine()) != null) {

			try {
//				if (iteration == 0) {
//					iteration++;
//					continue;
//				}

				String[] lineSplitted = line.split(",");

				String id = lineSplitted[0];
				String rolesStr = "";
				String actorsStr = "";
				if (lineSplitted.length > 10) {
					rolesStr = lineSplitted[10];
					if (lineSplitted.length > 11) {
							actorsStr = lineSplitted[11];
					}
				}
				else
				{
					System.err.println("missing columns for "+id);
					countMissingCol++;
				}
				String[] splitRoles = rolesStr.split("\\|");
				String[] splitActors = actorsStr.split("\\|");

				IdAndStats idAndStats = new IdAndStats();
				idAndStats.id = id;
				idAndStats.nbRoles = splitRoles.length;
				idAndStats.nbActors = splitActors.length;

				listStats.add(idAndStats);

				for (int i = 0; i < splitActors.length; i++) {
					String actorExploded = id + "," + splitActors[i] + "\r\n";
					writerActor.write(actorExploded);
//					System.out.println("actor\t"+actorExploded);
				}
				for (int i = 0; i < splitRoles.length; i++) {
					String roleExploded = id + "," + splitRoles[i] + "\r\n";
//					System.out.println("role\t"+roleExploded);
					writerRoles.write(roleExploded);
				}

				if (count % 1000 == 0) {
					// break;
					System.out.println(count + idAndStats.toString());
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

		System.out.println("sort by roles");
		listStats.sort(new MyComparator(false));
		for (int i = 0; i < 100; i++) {
			System.out.println(listStats.get(i));
		}

		System.out.println("sort by actors");
		listStats.sort(new MyComparator(true));
		for (int i = 0; i < 100; i++) {
			System.out.println(listStats.get(i));
		}

		System.out.println("countMissingCol\t\t"+countMissingCol);
		
		br.close();
		fr.close();
		writerActor.close();
		writerRoles.close();
	}

}
