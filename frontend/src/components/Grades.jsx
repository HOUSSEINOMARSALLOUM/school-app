import React, { useState, useEffect } from "react";
import { Filter, Download } from "lucide-react";

const mockAPI = {
  getGrades: async () => {
    // Example mock data; replace with real API call as needed.
    return {
      semester: "Fall 2025",
      subjects: [
        {
          name: "Mathematics",
          teacher: "Mr. Smith",
          average: 92,
          grades: [95, 88, 94],
        },
        {
          name: "Physics",
          teacher: "Mrs. Johnson",
          average: 85,
          grades: [82, 87, 85],
        },
      ],
    };
  },
};
const Grades = () => {
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState("all");

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await mockAPI.getGrades();
        setGradeData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, []);
  const loadGrades = React.useCallback(async () => {
    try {
      const data = await mockAPI.getGrades();
      setGradeData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  const getGradeColor = (avg) => {
    if (avg >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (avg >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (avg >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const filteredSubjects =
    filterSubject === "all"
      ? gradeData?.subjects || []
      : gradeData?.subjects.filter((s) => s.name === filterSubject) || [];

  const overallAverage =
    gradeData?.subjects.reduce((acc, s) => acc + s.average, 0) /
    (gradeData?.subjects.length || 1);

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Grade Sheet</h1>
        <p className="text-white/80 text-sm mb-4">{gradeData?.semester}</p>
        {gradeData && (
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/80 text-sm mb-1">Overall Average</p>
            <p className="text-3xl font-bold">{overallAverage.toFixed(1)}%</p>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            >
              <option value="all">All Subjects</option>
              {gradeData?.subjects.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            filteredSubjects.map((subject) => (
              <div
                key={subject.name}
                className="bg-white rounded-2xl p-5 shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-lg mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-slate-500 text-sm">{subject.teacher}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl font-bold text-lg border ${getGradeColor(
                      subject.average
                    )}`}
                  >
                    {subject.average.toFixed(1)}%
                  </div>
                </div>
                <div className="flex gap-2">
                  {subject.grades.map((grade, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-slate-50 rounded-lg p-3 text-center border border-slate-200"
                    >
                      <p className="text-xs text-slate-500 mb-1">
                        Test {idx + 1}
                      </p>
                      <p className="font-semibold text-slate-800">{grade}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;
