"use client";

import { LegalPageResult } from "@/types/legalPageTypes";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 12,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  subPoint: {
    marginLeft: 15,
    marginBottom: 5,
    fontSize: 12,
    flexDirection: "row",
  },
  bullet: {
    width: 10,
  },
  subPointText: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
});

interface LegalPagePDFProps {
  data: LegalPageResult;
}

export function LegalPagePDF({ data }: LegalPagePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>{data.heading}</Text>

        {/* Description */}
        {data.description && (
          <Text style={styles.description}>{data.description}</Text>
        )}

        {/* Terms and Conditions */}
        {data.points.map((term) => (
          <View key={term.id} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {term.sequence_number}. {term.heading}
            </Text>
            <Text style={styles.sectionContent}>{term.description}</Text>

            {/* Sub Points */}
            {term.sub_points.length > 0 && (
              <View>
                {term.sub_points.map((subPoint) => (
                  <View key={subPoint.id} style={styles.subPoint}>
                    <Text style={styles.bullet}>• </Text>
                    <Text style={styles.subPointText}>
                      {subPoint.sub_point}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          This document was generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
