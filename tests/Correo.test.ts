import { describe, it, expect } from "vitest";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

describe("Correo", () => {
      it("guarda el asunto y el cuerpo", () => {
            const remitente = new Contacto("Ana López", "ana@ucp.edu.ar");
            const destinatario = new Contacto("Juan Pérez", "juan@gmail.com");
            const correo = new Correo(remitente, [destinatario], "Asunto de prueba", "Cuerpo de prueba");
            expect(correo.getAsunto()).toBe("Asunto de prueba");
            expect(correo.getCuerpo()).toBe("Cuerpo de prueba");
  });
});