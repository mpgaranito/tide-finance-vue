| >>>     TARGET_DIR=$(find /target -name "index.html" -not -path "*/node_modules/*" -exec dirname {} \; | head -n 1) && \
  14 | >>>     if [ -n "$TARGET_DIR" ]; then \
  15 | >>>         echo "--> Sucesso! index.html encontrado em: $TARGET_DIR" && \
  16 | >>>         cp -r $TARGET_DIR/* /html-ready/; \
  17 | >>>     else \
  18 | >>>         echo "❌ ERRO: index.html não foi encontrado em lugar nenhum do build!" && exit 1; \
  19 | >>>     fi
  20 |     
--------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c mkdir /html-ready &&     TARGET_DIR=$(find /target -name \"index.html\" -not -path \"*/node_modules/*\" -exec dirname {} \\; | head -n 1) &&     if [ -n \"$TARGET_DIR\" ]; then         echo \"--> Sucesso! index.html encontrado em: $TARGET_DIR\" &&         cp -r $TARGET_DIR/* /html-ready/;     else         echo \"❌ ERRO: index.html não foi encontrado em lugar nenhum do build!\" && exit 1;     fi" did not complete successfully: exit code: 1
Error: buildx failed with: ERROR: failed to build: failed to solve: process "/bin/sh -c mkdir /html-ready &&     TARGET_DIR=$(find /target -name \"index.html\" -not -path \"*/node_modules/*\" -exec dirname {} \\; | head -n 1) &&     if [ -n \"$TARGET_DIR\" ]; then         echo \"--> Sucesso! index.html encontrado em: $TARGET_DIR\" &&         cp -r $TARGET_DIR/* /html-ready/;     else         echo \"❌ ERRO: index.html não foi encontrado em lugar nenhum do build!\" && exit 1;     fi" did not complete successfully: exit code: 1
