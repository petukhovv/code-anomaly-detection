# code-anomaly-detection

Program for anomaly detection in Kotlin source code.

Anomaly is Kotlin source code file, witch according to machine learning algorithms deviates from the norm.

Program consist of four top-level parts:
- parsing Kotlin source codes: Kotlin compiler run;
- CST (concrete syntax tree) extraction and factorization: CSTs transformation to a vectors by specified features configuration;
- autoencoding: run autoencoder neural network on the dataset obtained from the previous stage (vector set);
- anomaly selection based on the decoding losses obtained from the autoencoder (DBScan or 3/5-sigma deviation).
