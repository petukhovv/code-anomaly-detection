# code-anomaly-detection

Program for anomaly detection in Kotlin source code.

## Description

Anomaly is Kotlin source code file, witch according to machine learning algorithms deviates from the norm.

Program consist of four top-level parts:
- parsing Kotlin source codes: Kotlin compiler run;
- CST (concrete syntax tree) extraction and factorization: CSTs transformation to a vectors by specified features configuration;
- autoencoding: run autoencoder neural network on the dataset obtained from the previous stage (vector set);
- anomaly selection based on the decoding losses obtained from the autoencoder (DBScan or 3/5-sigma deviation).

These parts correspond to three tools included in code-anomaly-detection as submodules: [kotlin-source2ast](https://github.com/PetukhovVictor/kotlin-source2ast), [ast-set2matrix](https://github.com/PetukhovVictor/ast-set2matrix) and [anomaly-detection](https://github.com/PetukhovVictor/anomaly-detection).

## Program use

You run the program on the project you are interested in by specifying the project folder. The program analyzes only files with the `kt` exten
