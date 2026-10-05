export const scales = [
    { id: 'communicating', name: 'Communicating', left: 'Low-Context', right: 'High-Context' },
    { id: 'evaluating', name: 'Evaluating', left: 'Direct Negative Feedback', right: 'Indirect Negative Feedback' },
    { id: 'persuading', name: 'Persuading', left: 'Principles-First', right: 'Applications-First' },
    { id: 'leading', name: 'Leading', left: 'Egalitarian', right: 'Hierarchical' },
    { id: 'deciding', name: 'Deciding', left: 'Consensual', right: 'Top-Down' },
    { id: 'trusting', name: 'Trusting', left: 'Task-Based', right: 'Relationship-Based' },
    { id: 'disagreeing', name: 'Disagreeing', left: 'Confrontational', right: 'Avoids Confrontation' },
    { id: 'scheduling', name: 'Scheduling', left: 'Linear-Time', right: 'Flexible-Time' }
];

export const countries = {
    'US': { 
        id: 'US', name: 'United States', color: '#192f5d', 
        data: { communicating: -84, evaluating: -2, persuading: 84, leading: -23, deciding: 12, trusting: -88, disagreeing: -7, scheduling: -47 } 
    },
    'AU': { 
        id: 'AU', name: 'Australia', color: '#00008b', 
        data: { communicating: -72, evaluating: -25, persuading: 62, leading: -61, deciding: null, trusting: -57, disagreeing: -24, scheduling: null } 
    },
    'CA': { 
        id: 'CA', name: 'Canada', color: '#d52b1e', 
        data: { communicating: -74, evaluating: 5, persuading: 70, leading: -42, deciding: null, trusting: null, disagreeing: null, scheduling: null } 
    },
    'NL': { 
        id: 'NL', name: 'Netherlands', color: '#ae1c28', 
        data: { communicating: -62, evaluating: -78, persuading: 34, leading: -81, deciding: -60, trusting: -74, disagreeing: -58, scheduling: -47 } 
    },
    'DE': { 
        id: 'DE', name: 'Germany', color: '#ffcc00', 
        data: { communicating: -53, evaluating: -68, persuading: -35, leading: 5, deciding: -32, trusting: -52, disagreeing: -66, scheduling: -87 } 
    },
    'FI': { 
        id: 'FI', name: 'Finland', color: '#002f6c', 
        data: { communicating: -29, evaluating: null, persuading: null, leading: -42, deciding: null, trusting: -45, disagreeing: null, scheduling: null } 
    },
    'DK': { 
        id: 'DK', name: 'Denmark', color: '#c8102e', 
        data: { communicating: -32, evaluating: null, persuading: 19, leading: -84, deciding: null, trusting: -72, disagreeing: -44, scheduling: -48 } 
    },
    'GB': { 
        id: 'GB', name: 'United Kingdom', color: '#012169', 
        data: { communicating: -34, evaluating: 10, persuading: 43, leading: -13, deciding: -9, trusting: -31, disagreeing: -2, scheduling: -37 } 
    },
    'PL': { 
        id: 'PL', name: 'Poland', color: '#dc143c', 
        data: { communicating: -14, evaluating: null, persuading: null, leading: 44, deciding: null, trusting: -11, disagreeing: null, scheduling: -14 } 
    },
    'BR': { 
        id: 'BR', name: 'Brazil', color: '#f8e509', 
        data: { communicating: 2, evaluating: 24, persuading: -19, leading: 8, deciding: 22, trusting: 64, disagreeing: 14, scheduling: 51 } 
    },
    'AR': { 
        id: 'AR', name: 'Argentina', color: '#74acdf', 
        data: { communicating: 8, evaluating: 16, persuading: -11, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: null } 
    },
    'ES': { 
        id: 'ES', name: 'Spain', color: '#f1bf00', 
        data: { communicating: 11, evaluating: -30, persuading: -65, leading: 24, deciding: null, trusting: 21, disagreeing: -46, scheduling: 22 } 
    },
    'MX': { 
        id: 'MX', name: 'Mexico', color: '#006847', 
        data: { communicating: 18, evaluating: 30, persuading: 1, leading: 41, deciding: null, trusting: 47, disagreeing: 30, scheduling: 45 } 
    },
    'IT': { 
        id: 'IT', name: 'Italy', color: '#009246', 
        data: { communicating: 23, evaluating: -23, persuading: -80, leading: 29, deciding: 38, trusting: 28, disagreeing: -33, scheduling: 32 } 
    },
    'PE': { 
        id: 'PE', name: 'Peru', color: '#d91023', 
        data: { communicating: 25, evaluating: null, persuading: null, leading: 56, deciding: null, trusting: null, disagreeing: 46, scheduling: null } 
    },
    'FR': { 
        id: 'FR', name: 'France', color: '#e1000f', 
        data: { communicating: 32, evaluating: -52, persuading: -80, leading: 26, deciding: 29, trusting: 12, disagreeing: -77, scheduling: 9 } 
    },
    'SG': { 
        id: 'SG', name: 'Singapore', color: '#df0000', 
        data: { communicating: 40, evaluating: null, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: 20, scheduling: null } 
    },
    'RU': { 
        id: 'RU', name: 'Russia', color: '#0039a6', 
        data: { communicating: 38, evaluating: -80, persuading: -59, leading: 55, deciding: 59, trusting: 46, disagreeing: -62, scheduling: 29 } 
    },
    'IR': { 
        id: 'IR', name: 'Iran', color: '#239f40', 
        data: { communicating: 57, evaluating: null, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: null } 
    },
    'IN': { 
        id: 'IN', name: 'India', color: '#ff9933', 
        data: { communicating: 53, evaluating: 42, persuading: null, leading: 70, deciding: 67, trusting: 79, disagreeing: 40, scheduling: 76 } 
    },
    'SA': { 
        id: 'SA', name: 'Saudi Arabia', color: '#165d31', 
        data: { communicating: 60, evaluating: 62, persuading: null, leading: 65, deciding: null, trusting: 84, disagreeing: 44, scheduling: 84 } 
    },
    'KE': { 
        id: 'KE', name: 'Kenya', color: '#006600', 
        data: { communicating: 66, evaluating: 42, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: 82 } 
    },
    'CN': { 
        id: 'CN', name: 'China', color: '#ee1c25', 
        data: { communicating: 71, evaluating: 49, persuading: null, leading: 70, deciding: 75, trusting: 74, disagreeing: 54, scheduling: 62 } 
    },
    'KR': { 
        id: 'KR', name: 'Korea', color: '#0047a0', 
        data: { communicating: 81, evaluating: 65, persuading: null, leading: 85, deciding: null, trusting: null, disagreeing: null, scheduling: null } 
    },
    'ID': { 
        id: 'ID', name: 'Indonesia', color: '#e70011', 
        data: { communicating: 82, evaluating: 83, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: 80, scheduling: null } 
    },
    'JP': { 
        id: 'JP', name: 'Japan', color: '#bc002d', 
        data: { communicating: 84, evaluating: 87, persuading: null, leading: 86, deciding: -88, trusting: 42, disagreeing: 83, scheduling: -68 } 
    },
    'IL': { 
        id: 'IL', name: 'Israel', color: '#0038b8', 
        data: { communicating: null, evaluating: -86, persuading: null, leading: -65, deciding: null, trusting: null, disagreeing: -84, scheduling: null } 
    },
    'NO': {
        id: 'NO', name: 'Norway', color: '#ed2939',
        data: { communicating: null, evaluating: -46, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: null }
    },
    'GH': {
        id: 'GH', name: 'Ghana', color: '#006b3f',
        data: { communicating: null, evaluating: 60, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: null }
    },
    'TH': {
        id: 'TH', name: 'Thailand', color: '#2d2a4a',
        data: { communicating: null, evaluating: 87, persuading: null, leading: null, deciding: null, trusting: 63, disagreeing: 79, scheduling: null }
    },
    'SE': {
        id: 'SE', name: 'Sweden', color: '#005293',
        data: { communicating: null, evaluating: null, persuading: 12, leading: -86, deciding: -76, trusting: null, disagreeing: 24, scheduling: -62 }
    },
    'NG': {
        id: 'NG', name: 'Nigeria', color: '#008753',
        data: { communicating: null, evaluating: null, persuading: null, leading: 88, deciding: 88, trusting: 89, disagreeing: null, scheduling: 88 }
    },
    'AT': {
        id: 'AT', name: 'Austria', color: '#c8102e',
        data: { communicating: null, evaluating: null, persuading: null, leading: null, deciding: null, trusting: -13, disagreeing: null, scheduling: null }
    },
    'TR': {
        id: 'TR', name: 'Turkey', color: '#e30a17',
        data: { communicating: null, evaluating: null, persuading: null, leading: null, deciding: null, trusting: 56, disagreeing: null, scheduling: 52 }
    },
    'GH': {
        id: 'GH', name: 'Ghana', color: '#006b3f',
        data: { communicating: null, evaluating: null, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: 62, scheduling: null }
    },
    'CH': {
        id: 'CH', name: 'Switzerland', color: '#ff0000',
        data: { communicating: null, evaluating: null, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: -84 }
    },
    'CZ': {
        id: 'CZ', name: 'Czech Republic', color: '#11457e',
        data: { communicating: null, evaluating: null, persuading: null, leading: null, deciding: null, trusting: null, disagreeing: null, scheduling: -15 }
    }
};
